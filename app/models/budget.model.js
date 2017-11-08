'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BudgetSchema = new Schema({
    Overall: { type: Number },
    DateCreated: { type: Date, default: '' },
    User: { type: Schema.ObjectId, ref: 'User' }
});
BudgetSchema.statics.createBudget = function(newBudget) {
    newBudget.save((error => {
        //if (error) res.status(500).send(error);
    }))
};
mongoose.model('Budget', BudgetSchema);