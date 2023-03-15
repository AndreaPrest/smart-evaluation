const express = require("express");
const bodyParser = require("body-parser");
const {log} = require("mercedlogger")
const mongoose = require("mongoose");
require('dotenv').config();


// routes
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes")
const evalRouter = require("./routes/evalRoutes")
const userRouter = require("./routes/userRoutes")
const staffRouter = require("./routes/staffRoutes")

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

app.use("/api/auth/", authRouter);
app.use("/api/admin/", adminRouter);
app.use("/api/eval/", evalRouter);
app.use("/api/user/", userRouter);
app.use("/api/staff/", staffRouter);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(process.env.MONGOOSE_URI,{useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        app.listen(process.env.PORT, () => log.green("SERVER STATUS", `Listening on port 4000`))
    })
    .catch((err) => console.log(err));



