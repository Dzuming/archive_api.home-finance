const mongoose = require('mongoose');
const Category = mongoose.model('Category');

// exports.create = function(req, res) {
//     var johndoe = new Category({
//         name: "Jedzenie"
//     });
//     johndoe.save(function(err) { if (err) console.log('Error on save!') });
// }

exports.index = function(req, res) {
    Category.find({}, (err, Category) => {
        res.status(200).json(Category);
    })
}