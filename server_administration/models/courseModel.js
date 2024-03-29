const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        }
    }
);

module.exports = mongoose.model("Course", CourseSchema, 'Courses');