const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, user } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(user);

router.route('/').get(getAllUsers); 
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser); 

module.exports = router;
