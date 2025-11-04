import express from "express";
import {
  uploadMaterial,
  getMaterials,
  getMaterialsBySubject, // ✅ new
  deleteMaterial,
} from "../controllers/materialController.js";

const router = express.Router();

router.route("/")
  .get(getMaterials)
  .post(uploadMaterial);

// ✅ New route
router.get("/subject/:id", getMaterialsBySubject);

router.route("/:id")
  .delete(deleteMaterial);

export default router;
