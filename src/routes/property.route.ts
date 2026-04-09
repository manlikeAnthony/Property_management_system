import {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,

} from "../controllers/property.controller";
import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/async-handler";
import { upload } from "../config/multer";
import { validate } from "../middlewares/validator.middleware";
import { createPropertySchema, updatePropertySchema } from "../validator/property.validation";
const router = Router();

router.post("/", authenticateUser, upload.array("images", 5), validate(createPropertySchema), asyncHandler(createProperty));
router.put("/:id", authenticateUser, upload.array("images", 5), validate(updatePropertySchema), asyncHandler(updateProperty));
router.delete("/:id", authenticateUser, asyncHandler(deleteProperty));
router.get("/", asyncHandler(getAllProperties));
router.get("/:id", asyncHandler(getPropertyById));

export default router;