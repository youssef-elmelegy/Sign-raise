import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

connectDB();

const specs = swaggerJsdoc(
    {
      definition: {
        openapi: "3.1.0",
        info: {
          title: "Dinamow is the king",
          version: "1.0.0",
          description:
              "this docs have been done by the king of the world",
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
      },
      apis: ["./routes/*.js"],
    }
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
});
