import { Request } from "express";
import { user } from "../models/user";

export interface AuthRequest extends Request {
  user?: user;
}

export interface StatusError extends Error {
  statusCode?: number;
}
