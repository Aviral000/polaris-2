require('dotenv').config();

const MongoDB = {
    url: process.env.MONGO_URL,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}

const Server = {
    port: process.env.PORT_NUMBER
};

const Token_Key = {
    Private_key: process.env.SECRET_KEY
}

module.exports = { MongoDB, Server, Token_Key }