const router = require('express').Router();
const passport = require('passport');
const { findAllTask, getTaskByIdAndUserId, taskMaker, taskUpdator, taskDeletion } = require('../controller/task.controller');

const authenticate = passport.authenticate('jwt', { session: false });

router.get('/view', authenticate, findAllTask);
router.get('/view/:id', authenticate, getTaskByIdAndUserId);
router.post('/add', authenticate, taskMaker);
router.put('/update/:id', authenticate, taskUpdator);
router.delete('/delete/:id', authenticate, taskDeletion);

module.exports = router