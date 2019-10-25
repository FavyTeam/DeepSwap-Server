// Main Routers
var express = require('express')
var router = express.Router()

// Router Controllers
var _auth = require('./userRole')

router.post('/auth', _auth.auth)
router.post('/create', _auth.add)
router.post('/get', _auth.get)
router.post('/get_all', _auth.get_all)

module.exports = router