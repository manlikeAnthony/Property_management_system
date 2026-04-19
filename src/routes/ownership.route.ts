import {
    purchaseProperty,
    transferOwnership,
    getOwnershipHistory,
    getCurrentOwner,
    getOwnershipById,
    deleteOwnership,
} from "../controllers/ownership.controller";
import { Router } from "express";
import { authenticateUser , authorizeRoles } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/async-handler";
const router = Router();

router.post("/purchase/:id", authenticateUser, asyncHandler(purchaseProperty));
router.post("/transfer/:id", authenticateUser, asyncHandler(transferOwnership));
router.get("/history/:id", authenticateUser, asyncHandler(getOwnershipHistory));
router.get("/current-owner/:id", authenticateUser, asyncHandler(getCurrentOwner));
router.get("/:id", authenticateUser, asyncHandler(getOwnershipById));
router.delete("/:id", authenticateUser,authorizeRoles("ADMIN"), asyncHandler(deleteOwnership));

export default router;

