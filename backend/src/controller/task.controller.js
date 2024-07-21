const { getTaskById, addTask, updateTask, deleteTask, taskFromId } = require('../services/task.service');
const { StatusCodes } = require('http-status-codes');

const findAllTask = async (req, res) => {
    try {
        const task = await getTaskById(req.user._id);
        res.status(StatusCodes.OK).json(task);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
}

const getTaskByIdAndUserId = async (req, res) => {
    try {
        const task = await taskFromId(req.user._id, req.params.id);
        res.status(StatusCodes.OK).json(task);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
}

const taskMaker = async (req, res) => {
    try {
        const task = await addTask(req.body, req.user._id);
        res.status(StatusCodes.CREATED).json(task);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
}

const taskUpdator = async (req, res) => {
    try {
        const updatedTask = await updateTask(req.body, req.user._id, req.params.id);
        res.status(StatusCodes.OK).json(updatedTask);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
}

const taskDeletion = async (req, res) => {
    try {
        const taskDeletion = await deleteTask(req.user._id, req.params.id);
        res.status(StatusCodes.OK).json(taskDeletion);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
}

module.exports = { findAllTask, taskMaker, taskUpdator, taskDeletion, getTaskByIdAndUserId };