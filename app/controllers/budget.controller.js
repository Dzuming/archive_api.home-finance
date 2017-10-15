const mongoose = require('mongoose');
const Budget = mongoose.model('Budget');
const spending = mongoose.model('spending');
const profit = mongoose.model('profit');
// exports.create = function(req, res) {
//     var johndoe = new Budget({
//         Overall: 10000,
//         DateCreated: Date.now()
//     });
//     johndoe.save(function(err) { if (err) console.log('Error on save!') });
// }
exports.index = function(req, res) {
    Budget
        .find({})
        .populate("User", "Email")
        .exec((err, Budget) => {
            let allBudget = Budget.filter(element => {
                if (element.User) {
                    return element.User.Email === req.params.Email
                }
            })
            res.status(200).json(allBudget[allBudget.length - 1])
        })


}