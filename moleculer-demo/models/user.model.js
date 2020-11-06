"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
        required: "Please fill in a username",
        trim: true
    },
    password: {
        type: String,
        required: "Please fill in a password"
    }
}, {
    timestamps: false
});

// Add full-text search index
UserSchema.index({
    //"$**": "text"
    "password": "text",
    "name": "text"
});

module.exports = mongoose.model("User", UserSchema);