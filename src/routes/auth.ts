import express, { Router } from "express";
import * as ValidationSchema from "../validation/auth.schema";
import * as AuthController from "../controllers/auth";

const router: Router = express.Router();

//! User AUTH Routes
//* Sign Up (Using Email) [POST /auth/signup]
router.post(
  "/signup",
  ValidationSchema.authSignUpValidationSchema,
  AuthController.signup
);

//* Log In (Using Email) [POST /auth/login]
router.post(
  "/login",
  ValidationSchema.authLoginValidationSchema,
  AuthController.login
);

// TODO: Implement Google OAuth
//* OAuth Authentication (Using Google) [POST /auth/google]
// router.post(
//   "/google",
//   ValidationSchema.authGoogleValidationSchema,
//   AuthController.authgoogle
// );

export default router;