var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
    userID: String,
    problemID: String,
    lang: String,
    sourceCode: String,
    error: String,
    userOutput: String
});

AnswerSchema.statics = {
    create: function (data, cb) {
        var answer = new this(data);
        answer.save(cb);
    },

    get: function (query, cb) {
        this.find(query, cb);
    },

    getByName: function (query, cb) {
        this.find(query, cb);
    },

    update: function (query, updateData, cb) {
        this.findOneAndUpdate(query, { $set: updateData }, { new: true }, cb);
    },

    delete: function (query, cb) {
        this.findOneAndDelete(query, cb);
    }
}

var Answer = mongoose.model('Answer', AnswerSchema);
module.exports = Answer;
