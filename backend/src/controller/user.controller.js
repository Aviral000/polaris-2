const { StatusCodes } = require('http-status-codes')
const { addUser, loggedUser, updateExistingUser, getUserByExistingId, googleAddUser } = require('../services/user.service');

const signup = async (req, res) => {
    try {
        const user = await addUser(req.body);
        res.status(StatusCodes.CREATED).json({ data: user });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({error: error.message});
    }
}

const login = async (req, res) => {
    try {
        const { data: user, token } = await loggedUser(req.body);

        res.cookie('token', token, { maxAge: 3600000 });

        res.status(StatusCodes.OK).json({ data: user, token, loggedIn: true });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const updatedUser = await updateExistingUser(req.user._id, req.body);
        res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
}

const getLoggedUser = async (req, res) => {
    try {
        const user = await getUserByExistingId(req.user._id);
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
}

const addGoogleUser = async (req, res) => {
    try {
        const {user, exisitngUser, token} = await googleAddUser(req.body);
        res.status(StatusCodes.OK).json({ data: user === undefined ? exisitngUser : user, token, loggedIn: true });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
}

module.exports = { signup, login, updateUser, getLoggedUser, addGoogleUser };