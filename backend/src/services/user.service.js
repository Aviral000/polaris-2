const User = require("../models/user.model");
const { Token_Key } = require("../config/config");

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const addUser = async (data) => {
    try {
        const { firstName, email, password, confirmPassword } = data;

        if(!firstName || !email || !password) {
            throw new Error("Fill out the details properly");
        }

        if(password !== confirmPassword) {
            throw new Error("Please check your passport and confirm passpord again");
        }

        if(await findUserByEmail(email)) {
            throw new Error("Email is already taken");
        }

        const salt = await bcrypt.genSalt(10);
        const cryptedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ ...data, password: cryptedPassword });
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

const googleAddUser = async (data) => {
    try {
        const { fullName, email } = data;

        if(!fullName || !email) {
            throw new Error("Fill out the details properly");
        }

        const exisitngUser  = await User.findOne({ email: email });

        if(exisitngUser) {
            const token = await genToken(exisitngUser._id);
            return {exisitngUser, token};
        }

        const name = fullName.split(" ");
        const firstName = name[0];
        const lastName = name[1] ? name[1] : "" ;

        const user = await User.create({ firstName: firstName, lastName: lastName, email: email });

        const token = await genToken(user._id);
        return {user, token};
    } catch (error) {
        throw new Error(error);
    }
}

const loggedUser = async (data) => {
    try {
        const { email, password } = data;

        if(!email || !password) {
            throw new Error("Email and password shouldn't be blanked");
        }

        const user = await findUserByEmail(data);

        if(user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if(isPasswordCorrect) {
                const token = await genToken(user._id);

                return { data: user, token: token }
            } else {
                throw new Error("Invalid credentials");
            }
        } else {
            throw new Error("Email is not registered");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const updateExistingUser = async (userID, data) => {
    try {
        const user = await User.findOne({ _id: userID });

        if (!user) {
            throw new Error("Some Error from the server, try to re-login again");
        }

        if (data.firstName) user.firstName = data.firstName;
        if (data.lastName) user.lastName = data.lastName;
        if (data.email) user.email = data.email;
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            const cryptedPassword = await bcrypt.hash(data.password, salt);
            user.password = cryptedPassword;
        }
        await user.save();
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

const findUserByEmail = async (data) => {
    try {
        const user = await User.findOne({ email: data.email });
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

const findUserById = async (data) => {
    try {
        const user = await User.findById(data.id);
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

const genToken = async (id) => {
    const payload = { _id: id };
    const options = { expiresIn: '1h' };

    const token = jwt.sign(payload, Token_Key.Private_key, options);

    if(token) {
        return token;
    } else {
        throw new Error("Token creation failed")
    }
}

const getUserByExistingId = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { addUser, findUserById, loggedUser, updateExistingUser, getUserByExistingId, googleAddUser }