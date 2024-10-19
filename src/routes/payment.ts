import express, { Router } from "express";
import * as paymentController from "../controllers/payment";
// import * as validationSchema from "../validation/payment.schema";

const router: Router = express.Router();

//! Split Routes

//* Pay Split [GET /payment/split/:splitId]
router.get("/split/:splitId", paymentController.paySplit);

export default router;