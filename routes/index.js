import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

//router.get('/status', AppController.getStatus);
//router.get('/stats', AppController.getStats);
// should return if Redis is alive and if the DB is alive
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // should return the number of users and files in DB
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

module.exports = router;
