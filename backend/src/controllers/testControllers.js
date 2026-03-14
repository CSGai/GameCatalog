const testMethod = (req, res) => {
    res.send('This is a test');
}

const apitest = (req, res) => {
    const data = {
        'test': req.body.test
    };
    res.end(JSON.stringify(data));
}

module.exports = {
    testMethod,
    apitest
}