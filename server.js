const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL).then(() => {
    console.log("MongoDB connection success!");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

const userRouter = require("./routes/users");

app.use("/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});