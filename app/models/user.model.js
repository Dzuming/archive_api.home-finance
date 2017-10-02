"use strict"

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Name: {
        First: String,
        Last: String
    },
    Email: String,
    Password: String,
    Avatar: { data: Buffer, contentType: String },
    Salt: String,
    Admin: { type: Boolean, default: false },
    Active: { type: Boolean, default: false }
});
mongoose.model('User', UserSchema);