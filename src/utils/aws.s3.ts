import { awsRegion, imageFolderName, s3BucketName } from "../config/env";

export const defaultS3URL = `https://s3.${awsRegion}.amazonaws.com/${s3BucketName}/${imageFolderName}`;
