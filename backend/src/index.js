const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const passport = require("passport");
const configPassport = require("./config/passport");
const path = require('path');

const { MongoDB, Server } = require('./config/config');
const userRouter = require('./routes/user.route');
const taskRouter = require('./routes/task.route');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

configPassport(passport);

mongoose.connect(MongoDB.url, MongoDB.options)
    .then(() => {
        console.log("DB is connected");
    })
    .catch((err) => {
        console.log("DB discontinued", err);
    })

app.use('/u1/api/users', userRouter);
app.use('/u1/api/tasks', taskRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

app.listen(Server.port, () => {
    console.log(`Server is running on ${Server.port}`)
})