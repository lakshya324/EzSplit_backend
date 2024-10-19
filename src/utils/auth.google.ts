import { googleClientID } from "../config/env";
import { googleClient } from "../config/google.client";

export async function verifyToken(token: string) {
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: googleClientID,
    });
    const payload = ticket.getPayload();
    return payload;
}