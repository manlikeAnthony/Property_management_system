import {
    becomeLandlord,
    approveLandlord,
    rejectLandlord,
    getMyLandlordProfile,
    getAllLandlords,
    getAllLandlordApplications,
    getAllApprovedLandlords,
    getAllRejectedLandlords,
    getSingleLandlord,
    deleteLandlord,
} from "../controllers/landlord.controller";
import { Router } from "express";
import { authenticateUser , authorizeRoles } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/async-handler";
const router = Router();

router.get("/", authenticateUser, asyncHandler(getAllLandlords));
router.post("/become-landlord", authenticateUser, asyncHandler(becomeLandlord));
router.patch("/approve/:id", authenticateUser,authorizeRoles("ADMIN"), asyncHandler(approveLandlord));
router.patch("/reject/:id", authenticateUser,authorizeRoles("ADMIN"), asyncHandler(rejectLandlord));
router.get("/my-profile", authenticateUser, asyncHandler(getMyLandlordProfile));
router.get("/applications", authenticateUser,authorizeRoles("ADMIN"), asyncHandler(getAllLandlordApplications));
router.get("/approved", authenticateUser,authorizeRoles("ADMIN"), asyncHandler(getAllApprovedLandlords));
router.get("/rejected", authenticateUser,authorizeRoles("ADMIN"), asyncHandler(getAllRejectedLandlords));
router.get("/:id", authenticateUser, asyncHandler(getSingleLandlord));
router.delete("/:id", authenticateUser,authorizeRoles("ADMIN" , "LANDLORD"), asyncHandler(deleteLandlord));

export default router;