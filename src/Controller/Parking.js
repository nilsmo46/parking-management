const fs = require("fs");
const path = require("path");
const {
  ParkingZoneModel,
  ParkingSpaceModel,
  VehicleParkingModel,
} = require("../Models/ParkingZone");
const asyncHandler = require("../Helpers/AsyncHandler");
const ErrorResponse = require("../Helpers/errorResponse");

const parkingSpace = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../_Data/Parking_Space.json"),
    "utf-8"
  )
);
let parkingZone = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../_Data/Parking_Zone.json"),
    "utf-8"
  )
);

// @desc      Init Parking
// @route     POST /api/parking/init
// @access    Private
exports.initParking = asyncHandler(async (req, res, next) => {
  await ParkingSpaceModel.deleteMany({});
  await ParkingZoneModel.deleteMany({});
  await VehicleParkingModel.deleteMany({});
  parkingZone.map(async (zone) => {
    parkingzone = new ParkingZoneModel({
      title: zone.parking_zone.title,
    });
    parkingSpace.map((space) => {
      if (zone.parking_zone.title === space.parking_zone) {
        parkingspace = new ParkingSpaceModel({
          title: space.title,
          parking_zone: space.parking_zone,
          currentVehicle: "",
          currentBooking: "",
        });

        parkingzone.parking_space.push(parkingspace);
        parkingspace.save();
        parkingzone.save();
      }
    });
  });
  res.status(200).json({
    success: true,
  });
});

// @desc      Init Parking
// @route     POST /api/parking/currentStatus
// @access    Public
exports.currentStatus = asyncHandler(async (req, res, next) => {
  const parking = await ParkingZoneModel.find().populate({
    path: "parking_space",
    populate: {
      path: "vehicleParkings",
      model: "VehicleParking",
    },
  });
  res.status(200).json({
    success: true,
    data: parking,
  });
});

// @desc      Book Parking
// @route     POST /api/parking/bookParking
// @access    Public
exports.bookParking = asyncHandler(async (req, res, next) => {
  const { vehicle_id, parking_zone_id, parking_space_id } = req.body;

  let parkingSpace = await ParkingSpaceModel.findById(parking_space_id);

  if (parkingSpace.currentVehicle) {
    return next(new ErrorResponse("This slot is Occupied", 400));
  }

  const bookedVehicle = await VehicleParkingModel.create({
    vehicle_id,
    parking_zone_id,
    parking_space_id,
    booking_date_time: new Date(),
  });

  parkingSpace = await ParkingSpaceModel.findByIdAndUpdate(
    parking_space_id,
    {
      currentVehicle: vehicle_id,
      vehicleParkings: [...parkingSpace.vehicleParkings, bookedVehicle],
      currentBooking: bookedVehicle._id,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: parkingSpace,
  });
});

// @desc      Release Parking
// @route     POST /api/parking/releaseParking
// @access    Public
exports.releaseParking = asyncHandler(async (req, res, next) => {
  const { booking_id, parking_space_id } = req.body;

  let bookedVehicle = await VehicleParkingModel.findById(booking_id);

  if (!bookedVehicle) {
    return next(new ErrorResponse("Enter a Valid Booking Id", 400));
  }

  bookedVehicle = await VehicleParkingModel.findByIdAndUpdate(
    booking_id,
    {
      release_date_time: new Date(),
    },
    { new: true, runValidators: true }
  );

  await ParkingSpaceModel.findByIdAndUpdate(
    parking_space_id,
    {
      currentVehicle: "",
      currentBooking: null,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: bookedVehicle,
  });
});

// @desc      Report
// @route     POST /api/parking/report
// @access    Public
exports.report = asyncHandler(async (req, res, next) => {
  const { date, month, year } = req.body;
  const datee = `${year}-${month}-${date}`;
  const dateplusone = `${year}-${month}-${parseInt(date) + 1}`;
  const report = await VehicleParkingModel.find({
    booking_date_time: {
      $gte: new Date(datee).toISOString(),
      $lt: new Date(dateplusone).toISOString(),
    },
  }).populate("parking_space_id");
  res.status(200).json({
    success: true,
    data: report,
  });
});
