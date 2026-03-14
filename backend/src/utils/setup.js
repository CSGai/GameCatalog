function routerSetup() {
    const apiControllers = require('../controllers/apiControllers');
    const directoryControllers = require('../controllers/directoryControllers');
    const { Router } = require('express');
    const router = Router();

    return {
        'apiControllers': apiControllers,
        'directoryControllers': directoryControllers,
        'router': router
    }
}

function backendSetup() {

    const express = require('express');
    const apiRoutes = require('../routes/apiRoutes');
    const webRoutes = require('../routes/webServerRoutes');

    const backend = express();

    return {
        'app': backend,
        'api': apiRoutes,
        'webdir': webRoutes,
        'express': express
    };
}

module.exports = {
    backendSetup,
    routerSetup
}