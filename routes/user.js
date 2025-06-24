const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/user');


const router = express.Router()

router.route('/')
    .get(userController.getUsers)
    .post(userController.register)
    /*.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    //.delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);*/

router.post('/login', userController.login);
router.patch('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser)

module.exports = router

/*
async function getSubscriber(req, res, next) {
  let subscriber
  try {
    subscriber = await Subscriber.findById(req.params.id)
    if (subscriber == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.subscriber = subscriber
  next()
}
*/
