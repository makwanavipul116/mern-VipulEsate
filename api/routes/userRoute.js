import express from "express";
import { signup, signin, google, signOut } from '../controllers/userController.js'

const router = express.Router()
router.post('/sign-up', signup)
router.post('/sign-in', signin)
router.post('/google', google)
router.get('/sign-out', signOut)


export default router;