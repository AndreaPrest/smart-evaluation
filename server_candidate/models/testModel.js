const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TestSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
        },
        course: {
            type: String,
            required:true,
        },
        template: {
            type: Object,
            required:true,
        },
        creationDate: {
            type: Date,
            required: true,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        test: {
            type: Array,
            required: true
        },
        sustained: {
            type:Boolean,
            required: true
        },
        finalEvaluation: {
            type: Number,
            required: true
        },
        availableMinutes: {
            type: Number,
            required: true
        },
        passingGrade: {
            type: Number,
            required:true
        }
    }
);

module.exports = mongoose.model("Test", TestSchema, 'Tests');