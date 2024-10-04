import User from '../model/userModel.js'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            // return res.status(401).json({ success: false, message: "all filed are required" })
            return next(errorHandler(401, "all filed are required"))
        }
        const oldUser = await User.findOne({ email })
        // if (oldUser) return res.status(201).json({ success: false, message: "User already Register this email Please signin" })
        if (oldUser) return next(errorHandler(201, "User already Register this email Please signin"))
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const user = await new User({ username, email, password: hashedPassword }).save()
        res.status(201).json("user is created successfully")

    } catch (error) {
        next(error)
    }
}


export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return next(errorHandler(401, "All filed are required"))
        }

        const user = await User.findOne({ email })
        if (!user) return next(errorHandler(404, "User not found"))
        const validPassword = bcryptjs.compareSync(password, user.password)
        if (!validPassword) return next(errorHandler(401, "Wrong credential"))
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY)
        const expiryDate = new Date(Date.now() + 3600000)
        const { password: hashedPassword, ...rest } = user._doc
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_KEY)
            const { password: pass, ...rest } = user._doc
            res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = await new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo
            }).save()

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY)
            const { password: pass, ...rest } = newUser._doc
            res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)

        }
    } catch (error) {
        next(error)
    }
}


export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json("User signOut successFully")
    } catch (error) {
        next(error)
    }
}