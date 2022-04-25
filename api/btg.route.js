import express from 'express'
import UserCtrl from './user.controller.js'

const router = express.Router()

router.route('/').get(UserCtrl.apiGetUsers)
//router.route('/update').put(UserCtrl.apiUpdateUserBalance)
router.route('/push').put(UserCtrl.apiPushFund)

export default router 