import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = express.Router();

// return if Redis is alive and if the DB is alive too
router.get('/status', (req, res) => {
  AppController.getStatus(req, res);
});

// return the number of users and files in DB
router.get('/stats', (req, res) => {
  AppController.getStats(req, res);
});

// add a new user to database
/* router.post('/users', (req, res) => {
  UsersController.postNew(req, res);
}); */

router.post('/users', UsersController.postNew);

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);
router.get('/files/:id/data', FilesController.getFile);

module.exports = router;
