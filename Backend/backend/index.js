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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URL2];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
});

const nms = new NodeMediaServer(config);
nms.run();
