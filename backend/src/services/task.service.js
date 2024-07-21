const Task = require('../models/task.model');

const getTaskById = async (userID) => {
    try {
        const tasks = await Task.find({ userId: userID });
        return tasks;
    } catch (error) {
        throw new Error("Task retrieval failed");
    }
}

const taskFromId = async (userID, paramsId) => {
    try {
        const tasks = await Task.findOne({ userId: userID, _id: paramsId });
        return tasks;
    } catch (error) {
        throw new Error("Task retrieval failed", error);
    }
}

const addTask = async (data, userId) => {
    try {
        const lastTask = await Task.findOne({ userId }).sort({ taskNumber: -1 }).exec();
        const taskNumber = lastTask ? lastTask.taskNumber + 1 : 1;

        const task = await Task.create({ userId, taskNumber, description: data.description, title: data.title || "" });

        return task;
    } catch (error) {
        throw new Error("Task creation failed");
    }
}

const updateTask = async (data, userId, taskId) => {
    try {
        const task = await Task.findOne({ _id: taskId, userId });
        
        if (!task) {
            throw new Error("Task not found or doesn't belong to the user");
        }

        if (data.title) task.title = data.title;
        if (data.description) task.description = data.description;

        await task.save();
        return task;
    } catch (error) {
        throw new Error("Task update failed");
    }
};

const deleteTask = async (userId, taskId) => {
    try {
        const result = await Task.findOneAndDelete({ _id: taskId, userId });
        if (!result) {
            throw new Error("Task not found or doesn't belong to the user");
        }
        return result;
    } catch (error) {
        throw new Error("Task deletion failed");
    }
};

module.exports = { getTaskById, addTask, updateTask, deleteTask, taskFromId };