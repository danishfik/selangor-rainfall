/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const RainfallsController = () => import('#controllers/rainfalls_controller')

router.on('/').renderInertia('home')

router.group(() => {
    router.get('/locations', [RainfallsController, 'getLocations'])
    router.post('/locations', [RainfallsController, 'addLocation'])
    router.post('/rainfall/fetch', [RainfallsController, 'fetchAndSave'])
    router.post('/rainfall/clear', [RainfallsController, 'clearData'])
    router.get('/rainfall', [RainfallsController, 'getRainfall'])
}).prefix('api')
