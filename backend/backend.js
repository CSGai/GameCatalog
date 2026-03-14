const { backendSetup } = require('./src/utils/setup.js');
const mongo = require('./src/services/mongoDB/mongoDB.js');
require('dotenv/config');

setup = backendSetup();

const directories = setup['webdir'];
const express = setup['express'];
const api = setup['api'];
const backend = setup['app'];
var port = process.env.PORT;

backend.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`[${new Date().toISOString()}] [${ip}] ${req.method} ${req.url}`);
    next();
});
backend.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.setHeader('Access-Control-Max-Age', '3600');
    next();
  });
backend.use(express.json());
backend.use('/api', api);
backend.use('/', directories);


backend.listen(port, (error) => {
    janitor();
    if (!error && port != undefined) {
        console.log("Server is Up and Running on Port " + port);
        mongo.runDB();
    } else {
        console.log("Error occured during startup...", error);
    }
});

async function janitor() {
    // Define cleanup function
    const cleanup = async () => {
        console.log('Cleanup procedure initiated...');
        await mongo.closeClientConnection();
        console.log('Cleanup completed.');
    };

    // Listen for termination signals
    process.on('SIGINT', async () => {
        console.log('Received SIGINT signal. Cleaning up...');
        await cleanup();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('Received SIGTERM signal. Cleaning up...');
        await cleanup();
        process.exit(0);
    });

    // Listen for uncaught exceptions and unhandled rejections and handle them
    process.on('uncaughtException', async (error) => {
        console.error('Uncaught Exception:', error);
        await cleanup();
        process.exit(1);
    });

    process.on('unhandledRejection', async (reason, promise) => {
        console.error('Unhandled Promise Rejection:', reason);
        await cleanup();
        process.exit(1);
    });
}