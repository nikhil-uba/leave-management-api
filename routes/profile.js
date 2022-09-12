const express = require('express')
const router = express.Router()




const {deleteProfile, getProfile, createProfile } = require('../controllers/profile')


router.route('/').post(createProfile)

router.route('/:id').get(getProfile)
router.route('/:id').delete(deleteProfile)


module.exports = router