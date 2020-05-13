var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },problem:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "problem"
    },
    lang: String,
    sourceCode: String,
    result: [String],
    point: {
        type: Number,
        default: 0
    },
    timecreated: {
        type: Date,
        default: Date.now
    }
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
