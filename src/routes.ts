import express, { Router, Request, Response, NextFunction } from "express";
import { AuthRequest, StatusError } from "./types/types";
import authRoutes from "./routes/auth";
// import utilityRoutes from "./routes/utility";
import userRoutes from "./routes/user";
import paymentRoutes from "./routes/payment";
import { authMiddleware } from "./middlewares/auth";
// import adminRoutes from "./routes/admin";

const router: Router = express.Router();

//* Log Middleware
router.use((req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("\x1b[33m%s\x1b[0m", `API > ${req.method} ${req.url}`);
  next();
});

//* Auth Middleware
router.use("/auth", authRoutes);

//* Utility Routes
// router.use("/utility", utilityRoutes);

//* Payment Routes
router.use("/payment", paymentRoutes); // use to pay split

//* User Routes
router.use("/user", authMiddleware, userRoutes);

//* Admin Routes
// router.use("/admin", authAdminMiddleware, adminRoutes);

//* 404 Middleware
router.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not Found") as StatusError;
  error.statusCode = 404;
  next(error);
});

//* Error Handling Middleware
router.use(
  (error: StatusError, req: AuthRequest, res: Response, next: NextFunction) => {
    const status = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.status(status).json({ success: false, message: message });
  }
);

export default router;