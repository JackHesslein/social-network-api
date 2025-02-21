import { Router } from 'express';
const router = Router();
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, addFriend, removeFriend } from '../../controllers/userController.js';

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUserById).delete(deleteUser).put(updateUser);

router.route('/:userId/friends').post(addFriend);

router.route('/:userId/friends/:friendId').delete(removeFriend);

export default router ;