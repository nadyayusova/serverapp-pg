import express from 'express';
// для переключения на БД, необходимо 
// - установить PostgreSQL
// - создать БД по скрипту из data/database.sql и заполнить данными
// раскомментировать строку ниже и закомментировать следующую за ней
import { user } from '../controllers/user.controller.js';
// import { user } from '../controllers/local.user.controller.js';

const router = express.Router();

router.route('/').get(user.getUsers).post(user.createUser).put(user.updateUser);
router.route('/:userid').get(user.getOneUser).delete(user.deleteUser);

// import { authCheck } from '../db/auth.js';
// router.route('/')
//   .get([authCheck, user.getUsers])
//   .post([authCheck, user.createUser])
//   .put([authCheck, user.updateUser]);
// router.route('/:userid')
//   .get([authCheck, user.getOneUser])
//   .delete([authCheck, user.deleteUser]);

export {router as userRoute};
