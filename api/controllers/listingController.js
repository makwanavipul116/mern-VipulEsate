import Listing from "../model/listingModel.js"
import { errorHandler } from '../utils/error.js'

export const createListing = async (req, res, next) => {
    try {
        const list = await Listing.create(req.body)
        res.status(201).json(list)
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return next(errorHandler(404, 'listing is not found'))
    if (req.user.id !== listing.userRef) return next(errorHandler(401, 'You can access only your own listing'))

    try {
        await Listing.findByIdAndDelete(listing._id)
        res.status(200).json('Listing Deleted SuccessFully')
    } catch (error) {
        next(error)
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return next(errorHandler(404, 'not found Listing'))
    if (req.user.id !== listing.userRef) return next(errorHandler(401, 'You can access only your own listing'))
    try {
        const updatedList = await Listing.findByIdAndUpdate(req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(updatedList)
    } catch (error) {
        next(error)
    }
}

export const getListing = async (req, res, next) => {

    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) return next(errorHandler(404, 'Listing Not found'))
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}


export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';
        // const order = req.query.order === 'asc' ? 1 : -1; // Convert order to -1 or 1 for MongoDB sorting

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};