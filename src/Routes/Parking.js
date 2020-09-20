const express = require("express");
const {
  initParking,
  currentStatus,
  bookParking,
  releaseParking,
  report,
} = require("../Controller/Parking");
const router = express.Router();

const { protect, authorize } = require("../Middleware/Auth");

router.get(
  "/api/parking/init",
  protect,
  authorize("Booking_Counter_Agent"),
  initParking
);
router.get("/api/parking/currentStatus", protect, currentStatus);
router.post(
  "/api/parking/bookParking",
  protect,
  authorize("Booking_Counter_Agent"),
  bookParking
);
router.post("/api/parking/report", protect, report);
router.post(
  "/api/parking/releaseParking",
  protect,
  authorize("Booking_Counter_Agent"),
  releaseParking
);

module.exports = router;
