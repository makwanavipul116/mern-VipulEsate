import bcryptjs from 'bcryptjs'
import User from '../model/userModel.js'
import Listing from '../model/listingModel.js'

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "you can update only your own profile"))
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                eamil: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, { new: true })

        const { password, ...rest } = updateUser._doc

        res.status(200).json(rest)

    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can Delete Only your own account"))
    }

    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token').status(200).json("Account Deleted SuccessFully")

    } catch (error) {
        next(error)
    }
}

export const getAllListing = async (req, res, next) => {

    try {
        if (req.user.id === req.params.id) {
            const listing = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listing)
        } else {
            return next(errorHandler(401, "You can not access other user list"))
        }

    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return next(errorHandler(404, 'User Not Found'))
        const { password: pass, ...rest } = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}