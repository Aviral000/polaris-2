const { required } = require('joi');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String
    },
    taskNumber: {
        type: Number
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

taskSchema.pre('save', function (next) {
    if (!this.title) {
        this.title = `Task ${this.taskNumber}`;
    }
    next();
});

taskSchema.index({ userId: 1, taskNumber: 1 }, { unique: true });

const Task = mongoose.model('task', taskSchema);

module.exports = Task;