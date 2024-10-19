import hpp from "hpp";
import cors from "cors";
// import csurf from "csurf";
import morgan from "morgan";
import helmet from "helmet";
import express, { Request } from "express";
import mongoose from "mongoose";
import enforce from "express-sslify";
import bodyParser from "body-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";

import router from "./routes";
import { ipExpireTime, ipRateLimit, mongoDbUri, port } from "./config/env";

const app = express();

app.use(cors());
// app.use(bodyParser.json()); // application/json
// app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded

app.use(hpp());
app.use(helmet());
app.use(compression());
//! Commant below line for LOCALHOST -or- HTTP
app.use(enforce.HTTPS({ trustProtoHeader: true }));

// app.use(csurf());

// Trusting reverse proxy (like Nginx) to handle X-Forwarded-For headers
app.set('trust proxy', true);

// IP Rate Limiter
//TODO: Check wiether it is taking nginx IP (due to forwarding) or client IP
app.use(rateLimit({
  windowMs: ipExpireTime * 60 * 1000,
  max: ipRateLimit,
  message: `Too many requests from this IP, please try again after ${ipExpireTime} minutes`,
  keyGenerator: (req: Request) => {
    return req.ip || "unknown";
  }
  }));

app.use(bodyParser.json()); // application/json

app.use(morgan("dev"));

// Print IP Address
app.use((req, res, next) => {
  console.log("\x1b[33m%s\x1b[0m", `IP > ${req.ip}`);
  next();
});

//* Routes
app.use(router);

mongoose
  .connect(mongoDbUri)
  .then(async (result) => {
    app.listen(port, () =>
      console.log("\x1b[36m%s\x1b[0m", `Server started on port ${port}`)
    );
  })
  .catch((err) => console.log(err));