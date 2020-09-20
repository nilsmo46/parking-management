const mongoose = require("mongoose");

const VehicleParkingSchema = new mongoose.Schema({
  vehicle_id: {
    type: String,
    required: true,
  },
  parking_zone_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingZone",
    required: true,
    enum: ["A", "B", "C"],
  },
  parking_space_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingSpace",
    required: true,
  },
  booking_date_time: {
    type: Date,
  },
  release_date_time: {
    type: Date,
  },
});

const VehicleParkingModel = mongoose.model(
  "VehicleParking",
  VehicleParkingSchema
);

const ParkingSpaceSchema = new mongoose.Schema({
  title: String,
  parking_zone: String,
  currentVehicle: {
    type: String,
    defaultValue: "",
  },
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VehicleParking",
  },
  vehicleParkings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleParking",
    },
  ],
});

ParkingSpaceSchema.virtual("vehicleCount").get(function () {
  return this.vehicleParkings.length;
});

const ParkingSpaceModel = mongoose.model("ParkingSpace", ParkingSpaceSchema);

const ParkingZoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: ["A", "B", "C"],
  },
  parking_space: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSpace",
    },
  ],
});

const ParkingZoneModel = mongoose.model("ParkingZone", ParkingZoneSchema);
module.exports = { ParkingZoneModel, ParkingSpaceModel, VehicleParkingModel };
