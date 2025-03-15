import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import dailyRoutes from "./routes/daily.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// const CLIENT_URL = process.env.CLIENT_URL;

app.use(cors());

app.use(express.json());
app.use(cookieParser());

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const specs = swaggerJsdoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Dinamow is the king",
      version: "1.0.0",
      description: "this docs have been done by the king of the world",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "DINAMOW",
        url: "http://127.0.0.1:3000/",
        email: "meemoo102039@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // (Optional) Apply globally to all endpoints:
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, "./routes/*.js")],
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.get("/", (req, res) => {
res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/daily", dailyRoutes);

app.listen(PORT, "0.0.0.0", () => {
console.log(`Server is running on ${PORT}`);
});