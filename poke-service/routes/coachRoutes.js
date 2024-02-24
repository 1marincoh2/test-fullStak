const express = require('express');
const router = express.Router();
const coachController = require('../controller/coachController');

router.post('/coach', coachController.createCoach);
router.get('/coach', coachController.getCoachs);
router.get('/coach/:id', coachController.getCoachById);
router.put('/coach/:id', coachController.updateCoach);
router.delete('/coach/:id', coachController.deleteCoach);

module.exports = router;
