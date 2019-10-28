// Main Routers
var express = require('express')
var router = express.Router()

// Router Controllers
var _auth = require('./userRole')
var _apn = require('./apn')

router.post('/auth', _auth.auth)
router.post('/create', _auth.add)
router.post('/get', _auth.get)
router.post('/get_all', _auth.get_all)
router.post('/online', _auth.set_online)
router.post('/offline', _auth.setoffline)

router.post('/send_notification', _apn.sendNotification)

module.exports = router