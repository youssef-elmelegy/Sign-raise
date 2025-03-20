import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), '..');

export const specs = swaggerJsdoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Sign-Raise",
      version: "1.0.0",
      description: "Sign-Raise is a platform for secure video conferencing and live translation.",
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
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          in: "header",
        }
      },
    },
    // Apply cookie-based authentication globally to all endpoints:
    security: [{ BearerAuth: [] }],
  },
  apis: [path.join(__dirname, "./routes/*.js")],
});

export const config = {
  bind: '0.0.0.0',
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media',
    api: true, // Enable the admin API
  },
  relay: {
    ffmpeg: '/usr/local/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        mode: 'push',
        edge: 'rtmp://localhost:1935/live',
      }
    ]
  }
};
