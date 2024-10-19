import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 4000;
export const mongoDbUri = process.env.MONGODB_URI!;
export const secretKey = process.env.SECRET_KEY!;
export const tokenExpireTime = process.env.TOKEN_EXPIRE_TIME || "7d";
export const saltRounds = +process.env.SALT_ROUNDS!;
export const expireOTP = process.env.EXPIRE_OTP || "10m";
export const ipExpireTime = +process.env.IP_EXPIRE_TIME!; // in mins
export const ipRateLimit = +process.env.IP_RATE_LIMIT!;

export const googleClientID = process.env.GOOGLE_CLIENT_ID!;
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;

export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID!;
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
export const awsRegion = process.env.AWS_REGION || "ap-south-1";
export const s3BucketName = process.env.S3_BUCKET_NAME!;
export const imageFolderName = process.env.S3_IMAGE_FOLDER_NAME!;

export const imageSize = +process.env.IMAGE_SIZE!; // in MB

export const transporter ={
    service: process.env.EMAIL_SERVICE!,
    auth: {
      user: process.env.EMAIL!,
      pass: process.env.PASSWORD!,
    },
}