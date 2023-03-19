import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

// return if Redis is alive and if the DB is alive too
router.get('/status', (req, res) => {
  AppController.getStatus(req, res);
});

// return the number of users and files in DB
router.get('/stats', (req, res) => {
  AppController.getStats(req, res);
});

module.exports = router;
