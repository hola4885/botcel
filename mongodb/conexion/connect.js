const mongoose = require('mongoose');
const config = require('../../cnf/config.json')
const colors = require('colors')

    mongoose.connect(config.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.once("open", () => {
        console.log("----------------------------------------".yellow);
        console.log(`[MONGO] Connected to Database`.green.bold)
    });
    return;


module.exports = connect