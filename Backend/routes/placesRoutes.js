import express from "express";
import { getNearbyDentists } from "../controllers/placesController.js";

const router = express.Router();

router.get("/nearby-dentists", getNearbyDentists);

export default router;
