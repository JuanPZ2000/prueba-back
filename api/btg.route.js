import express from 'express'
import UserCtrl from './user.controller.js'

const router = express.Router()

router.route('/').get(UserCtrl.apiGetUsers)
router.route('/balance').get(UserCtrl.apiGetBalance)
router.route('/push').put(UserCtrl.apiPushFund)
router.route('/pop').delete(UserCtrl.apiPopFund)
router.route('/historical').get(UserCtrl.apiGetHistorical)
router.route('/balance/fund').get(UserCtrl.apiGetFundBalance)


export default router 