const getMainPage = (req, res) => {
    res.sendFile(__dirname, 'src\\public\\scripts\\frontPage.jsx');
}

module.exports = {
    getMainPage
}