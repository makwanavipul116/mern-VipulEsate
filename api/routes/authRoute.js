import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { updateUser, deleteUser, getAllListing, getUser } from '../controllers/authController.js'

const router = express.Router()

router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getAllListing)
router.get('/:id', verifyToken, getUser)

export default router