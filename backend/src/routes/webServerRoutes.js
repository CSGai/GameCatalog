const { routerSetup } = require('../utils/setup.js');

setup = routerSetup();

controllers = setup['directoryControllers'];
router = setup['router'];

router.get('/', controllers.getMainPage);

module.exports = router;