"use strict"

const mongoose = require('mongoose');
const profit = mongoose.model('profit');
const Budget = mongoose.model('Budget');
exports.create = function(req, res) {
    let newProfit = new profit({
        Category: req.body.categoryId,
        Description: req.body.Description,
        Profit: req.body.Profit,
        User: req.body.userId,
        DateCreated: Date.now()
    })
    newProfit.save((error => {
        if (error) res.status(500).send(error);
        res.status(201).json({
            message: 'Question created successfully'
        });
    }))
    Budget.find({}, (err, Value) => {
            if (!Value[0].Overall) {
                Value[0].Overall = 10000;
            }
            let newBudget = new Budget({
                Overall: Value[0].Overall + req.body.Profit,
                DateCreated: Date.now(),
                User: req.body.userId
            })
            Budget.createBudget(newBudget)
        })
        .sort({ 'DateCreated': 'desc' })
        .exec((err, profit) => profit.filter(element => {
            if (element.User) {
                element.User.id === req.params.id
            }
        }))
}
exports.index = function(req, res) {
    profit.find({})
        .populate("Category")
        .populate("User", "id")
        .sort({ 'DateCreated': 'desc' })
        .exec((err, profit) => {
            res.status(200).json(profit.filter(element => {
                if (element.User) {
                    return element.DateCreated.toISOString().split('T')[0] //YYYY-MM-DD 
                        .includes(req.params.DateCreated.toString()) && element.User.id === req.params.id
                }
            }))
        })
}