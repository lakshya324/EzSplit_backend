import { checkSchema } from "express-validator";

export const authSignUpValidationSchema = checkSchema({
    username: {
        in: ["body"],
        isString: {
        errorMessage: "Invalid Username",
        },
        trim: true,
    },
    email: {
        in: ["body"],
        isEmail: {
        errorMessage: "Invalid Email",
        },
        trim: true,
    },
    password: {
        in: ["body"],
        isLength: {
            errorMessage: "Password must be at least 6 characters long",
            options: { min: 6 },
          },
    },
});

export const authLoginValidationSchema = checkSchema({
    email: {
        in: ["body"],
        isEmail: {
        errorMessage: "Invalid Email",
        },
        trim: true,
    },
    password: {
        in: ["body"],
        isLength: {
        options: { min: 6 },
        errorMessage: "Password too short",
        },
        trim: true,
    },
});

export const authGoogleValidationSchema = checkSchema({
    token: {
        in: ["body"],
        isString: {
        errorMessage: "Invalid Token",
        },
        trim: true,
    },
});