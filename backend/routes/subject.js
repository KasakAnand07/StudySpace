import express from "express";
import {
  addSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.route("/")
  .get(getSubjects)
  .post(addSubject);

router.route("/:id")
  .get(getSubjectById)
  .put(updateSubject)
  .delete(deleteSubject);

export default router;
