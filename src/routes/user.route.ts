import {
  getAllUsers,
  getAllAdmins,
  getCurrentUser,
  getSingleUser
} from "../controllers/user.controller";
import { Router } from "express";
import { authenticateUser, authorizeRoles } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/async-handler";

const router = Router();

router.route("/").get(authenticateUser, authorizeRoles("ADMIN"), asyncHandler(getAllUsers));

router
  .route("/admins")
  .get(authenticateUser, authorizeRoles("ADMIN"), asyncHandler(getAllAdmins));


router.route('/current-user').get(authenticateUser, authorizeRoles("ADMIN"), asyncHandler(getCurrentUser));

router.route('/:id').get(authenticateUser, authorizeRoles("ADMIN"), asyncHandler(getSingleUser));


export default router;