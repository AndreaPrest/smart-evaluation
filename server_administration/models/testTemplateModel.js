const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestTemplateSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        course: {
            type: Object,
            required:true,
        },
        creator: {
            type: String,
            required: true,
        },
        template: {
            type: Array,
            required: true,
        },
        availableMinutes: {
            type: Number,
            required:true
        },
        passingGrade: {
            type:Number,
            required:true
        }
    }
);

module.exports = mongoose.model("TestTemplate", TestTemplateSchema, 'TestTemplates');