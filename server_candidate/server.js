const express = require("express");
const bodyParser = require("body-parser");
const {log} = require("mercedlogger")
const mongoose = require("mongoose");
require('dotenv').config();

const candidateRouter = require("./routes/candidateRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/api/candidate/",candidateRouter)
app.use("/api/auth/",authRouter)

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .set('strictQuery', false)
    .connect(process.env.MONGOOSE_URI,{useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        app.listen(process.env.PORT, () => log.green("SERVER STATUS", `Listening on port ` + process.env.PORT))
    })
    .catch((err) => console.log(err));