import express from "express";
import cors from "cors";
import connect from "./db";
import dotenv from "dotenv";
import routes from "./routes";
import http from "http";
import { handleSocket } from "./socket";
import { PORT, URL_LOCALHOST, URL_PRODUCTION } from "./utils/types";
import { logger } from "./logger";

dotenv.config();

const app = express();

const server = http.createServer(app);

const allowedOrigins: string[] = ['http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(logger );

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

routes(app);

connect();

handleSocket(server);

server.listen(PORT, () => {
  console.log(`Server listing at port: ${PORT}`);
});
