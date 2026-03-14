const { routerSetup } = require('../utils/setup.js');

setup = routerSetup();

controllers = setup['apiControllers'];
router = setup['router'];

/*  
    addUserGames,
    removeUserGames,
    addGameToCatalog,
    removeCatalogGames,
    createUser,
    deleteProfiles,
    userProfile,
    GameList,
    userList
*/

//POST methods
router.post('/createNewUser', controllers.createUser);
router.post('/addUserGames', controllers.addUserGames);
router.post('/userInfo', controllers.userProfile);
router.post('/addGameToCatalog', controllers.addGameToCatalog);
//DELETE methods
router.delete('/removeUser', controllers.deleteProfiles);
router.delete('/removeGameFromUser', controllers.removeUserGames);
router.delete('/removeCatalogGames', controllers.removeCatalogGames);
//GET methods
router.get('/userList', controllers.userList);
router.get('/gameList', controllers.gameList);
router.get('/GameCatalog_IDs', controllers.GameCatalog_IDs)

module.exports = router;