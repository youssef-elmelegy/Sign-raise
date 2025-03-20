import express from "express";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import dailyRoutes from "./routes/daily.route.js";
import cookieParser from "cookie-parser";
import NodeMediaServer from "node-media-server";
import { specs, config } from "./config/appConfig.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const normalizeOrigin = (origin) => {
  return origin && origin.endsWith('/') ? origin.slice(0, -1) : origin;
};

// Normalize the allowed origins from environment variables
const allowedOrigins = [
  normalizeOrigin(process.env.CLIENT_URL),
  normalizeOrigin(process.env.CLIENT_URL2),
  normalizeOrigin(process.env.CLIENT_URL3),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Normalize the incoming origin and check against the allowed list
      if (allowedOrigins.includes(normalizeOrigin(origin))) {
        return callback(null, true);
      } else {
        console.log("Rejected origin: " + origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

connectDB().catch((error) =>
  console.error("Error connecting to the database: ", error.message)
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/daily", dailyRoutes);

app.get('/exported', (req, res) => {
  res.sendFile(path.join(__dirname, 'exported', 'model.tflite'));
});

// /word route: Serve the word.tflite file.
app.get('/word', (req, res) => {
  res.sendFile(path.join(__dirname, 'exported', 'word.tflite'));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
});

const nms = new NodeMediaServer(config);
nms.run();