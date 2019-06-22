import express from 'express';

import LocationsController from '../controllers/locations';

const router = express.Router();

router.get('/', LocationsController.getLocations);
router.post('/', LocationsController.createLocation);
router.get('/:id', LocationsController.getLocation);
router.patch('/:id', LocationsController.updateLocation);
router.delete('/:id', LocationsController.deleteLocation);

export default router;