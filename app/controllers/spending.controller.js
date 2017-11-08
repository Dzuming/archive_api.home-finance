"use strict"

const mongoose = require('mongoose');
const spending = mongoose.model('spending');
const Budget = mongoose.model('Budget');
exports.create = function(req, res, next) {
    let newSpending = new spending({
        Category: req.body.categoryId,
        Description: req.body.description,
        Spending: req.body.spending,
        User: req.body.userId,
        DateCreated: Date.now()
    })
    newSpending.save((error => {
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
                Overall: Value[0].Overall - req.body.Spending,
                DateCreated: Date.now(),
                User: req.body.userId
            })
            Budget.createBudget(newBudget)
        })
        .sort({ 'DateCreated': 'desc' })
        .exec((err, spending) => spending.filter(element => {
            if (element.User) {
                element.User.id === req.params.id
            }
        }))
}
exports.index = function(req, res) {
    spending.find({})
        .populate("Category")
        .populate("User", "id")
        .sort({ 'DateCreated': 'desc' })
        .exec((err, spending) => {
            res.status(200).json(spending.filter(element => {
                if (element.User) {
                    return element.DateCreated.toISOString().split('T')[0] //YYYY-MM-DD 
                        .includes(req.params.DateCreated.toString()) && element.User.id === req.params.id
                }
            }))
        })
}
exports.period = function(req, res) {
    spending.find({})
        .select('DateCreated')
        .exec((err, spending) => {
            if (spending[0]) {
                res.status(200).json({
                    'startDate': spending[0].DateCreated.toISOString().split('T')[0],
                    'endDate': spending[spending.length - 1].DateCreated.toISOString().split('T')[0]
                })
            }

        })
}