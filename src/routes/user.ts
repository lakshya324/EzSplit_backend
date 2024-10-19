import express, { Router } from "express";
import * as userController from "../controllers/user";
import * as validationSchema from "../validation/user.schema";

const router: Router = express.Router();

//! User Routes
//* fetch User Data [GET /user]
router.get("/", userController.fetchUser);

//* Update Password User Data [PATCH /user/password]
// Todo: Implement Update Password

//* Update User Data [PATCH /user]
// router.patch("/", validationSchema.updateUserValidationSchema, userController.updateUser);

//* Update Profile Picture [PATCH /user/picture]
// router.patch("/picture", validationSchema.profilePictureValidationSchema, userController.updateProfilePicture);

//! Split Routes

//* Create Equal Split [POST /user/split]
router.post("/split", validationSchema.splitValidationSchema, userController.createSplit);

//* Create Percentage Split [POST /user/split/percentage]
router.post("/split/percentage", validationSchema.percentageSplitValidationSchema, userController.createPercentageSplit);

//* Create Custom Split [POST /user/split/custom]
router.post("/split/custom", validationSchema.customSplitValidationSchema, userController.createCustomSplit);

//* Fetch All Splits [GET /user/split]
router.get("/split", userController.fetchSplits);
// Query: fetch = created | received | all

//* Fetch Split [GET /user/split/:splitId]
router.get("/split/:splitId", userController.fetchSplit);

//* Update User Status in Split [GET /user/split/:splitId/:userId]
router.get("/split/:splitId/:userId", userController.updateUserStatusInSplit);
// Query: status = paid | unpaid [If not provided, it will toggle the status]

//* Update Split [PATCH /user/split/:splitId]
// router.patch("/split/:splitId", userController.updateSplit);

//* Settle Split [DELETE /user/split/:splitId]
router.delete("/split/:splitId", userController.settleSplit);

//! Friend Routes

//* Fetch All Friends [GET /user/friend]
router.get("/friend", userController.fetchAllFriends);

//* Fetch Friend [GET /user/friend/:friendId]
router.get("/friend/:friendId", userController.fetchFriend);

//* Remove Friend [DELETE /user/friend/:friendId]
router.delete("/friend/:friendId", userController.removeFriend);

//? Friend Request Routes

//* Fetch all Friend Requests [GET /user/friend/request]
router.get("/friend/request", userController.fetchAllFriendRequests);
// Query: type = sent | received | all

//* Send Friend Request [GET /user/friend/request/:friendId]
router.get("/friend/request/:friendId", userController.sendFriendRequest);

//* Accept Friend Request [GET /user/friend/request/:requestId]
router.get("/friend/request/accept/:requestId", userController.acceptFriendRequest);

//* Reject Friend Request [DELETE /user/friend/request/:requestId]
router.delete("/friend/request/:requestId", userController.rejectFriendRequest);

export default router;