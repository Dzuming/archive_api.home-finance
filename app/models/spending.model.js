'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SpendingSchema = new Schema({
    Category: { type: Schema.ObjectId, ref: 'Category' },
    DateCreated: { type: Date, default: '' },
    Description: { type: String, default: '' },
    Spending: { type: Number, default: '' },
    User: { type: Schema.ObjectId, ref: 'User' }
});
SpendingSchema.statics.sumValues = function(element, prop) {
    return element.reduce((accumulator, current) => accumulator + current[prop], 0);
};
mongoose.model('spending', SpendingSchema);