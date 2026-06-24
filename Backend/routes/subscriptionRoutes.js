import express from "express";
import {
  getSubscription,
  subscribe,
  recordUsage,
  cancelSubscription,
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/",          protect, getSubscription);
router.post("/subscribe", protect, subscribe);
router.post("/record",    protect, recordUsage);
router.post("/cancel",    protect, cancelSubscription);

export default router;
