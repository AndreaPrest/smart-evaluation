const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        content: {
            type: Object,
            required:true
        },
        courses: {
            type: Array,
            // required?
        },
        topics: {
            type: Array,
            // required?
        },
        creator: {
            type: String,
            //Not required because user can be deleted
        },
        type: {
            type: String
        }

    }
);

module.exports = mongoose.model("Question", QuestionSchema, 'Questions');