require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth");
const prosumerRoutes = require("./routes/prosumer");
const transactionRoutes = require("./routes/transaction");
const cardRoutes = require("./routes/card");

//DB Connections
mongoose
  .connect(process.env.DATABASE, {
    userNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes); //The authRoutes are prefixed with /api/...
app.use("/api", prosumerRoutes);
app.use("/api", transactionRoutes);
app.use("/api", cardRoutes);

//PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
