const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicSchema = new Schema(
    {
        parent: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        children: {
            type: Array,
            default: []
        },
        questionsNumber: {
            type: Number,
            default: 0
        }
    }
);

module.exports = mongoose.model("Topic", TopicSchema, 'Topics');