const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const ConnectDB = require("./src/Helpers/ConnectDB");
const errorHandler = require("./src/Middleware/Error");
const path = require("path");

// Load env vars
dotenv.config({ path: "./src/Config/Config.env" });

ConnectDB();

const app = express();

app.set("trust proxy", true);
// Body parser
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// Mount Routers
const User = require("./src/Routes/User");
const Parking = require("./src/Routes/Parking");
app.use(User);
app.use(Parking);

app.use(express.static(path.join(__dirname, ".", "/client/build")));

app.use(errorHandler);

app.listen(4000, () => {
  console.log("Listening at 4000");
});
