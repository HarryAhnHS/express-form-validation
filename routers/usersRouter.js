var express = require('express');
var usersRouter = express();
var usersController = require('../controllers/usersController');

usersRouter.get('/', usersController.usersAllGet);

usersRouter.get('/create', usersController.usersCreateGet);
usersRouter.post('/create', usersController.usersCreatePost);

usersRouter.get('/:id/update', usersController.usersUpdateGet);
usersRouter.post('/:id/update', usersController.usersUpdatePost);

usersRouter.post('/:id/delete', usersController.userDelete);

usersRouter.get('/search', usersController.userSearchGet);

module.exports = {
    usersRouter
}


