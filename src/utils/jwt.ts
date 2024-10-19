import jwt, { JwtPayload } from "jsonwebtoken";
import { secretKey, tokenExpireTime } from "../config/env";
import { StatusError } from "../types/types";

export function generateJwtToken(id: string): string {
  // This function is used to generate a JWT token
  return (
    "Bearer " + jwt.sign({ id }, secretKey, { expiresIn: tokenExpireTime })
  );
}

export function verifyJwtToken(header: string | undefined): JwtPayload {
  // This function is used to verify the JWT token
  // Return decoded token if valid else throw error
  try {
    // Checking Authorization header
    if (!header) {
      throw new Error("Not authenticated.");
    }

    // Bearer token
    const set = header.split(" ");
    const token = set[set.length - 1];
    let decodedToken: JwtPayload;

    // Decode token
    decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    if (!decodedToken) {
      throw new Error("Not authenticated.");
    }
    return decodedToken;
  } catch (err) {
    const error = new Error("Not authenticated.") as StatusError;
    error.statusCode = 401;
    throw error;
  }
}
