import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

const Listingitem = ({ listing }) => {
    return (
        <div className='p-2 bg-white w-full sm:w-[280px] shadow-md hover:shadow-lg transition-shadow  rounded-lg '>
            <Link to={`/listing/${listing._id}`} >
                <img src={listing.imageUrls[0]} alt='image cover' className='h-[300px] sm:h-[220px] object-cover w-full rounded-lg hover:scale-105 transition-scale duration-300' />
            </Link>

            <div className="p-3 flex flex-col gap-2 w-full">
                <p className=' text-lg text-slate-700 font-semibold truncate'>{listing.name}</p>

                <div className="flex items-center gap-1">
                    {<MdLocationOn className='text-green-700 w-4 h-4 ' />}
                    <p className='truncate text-sm text-gray-600 w-full'>{listing.address}</p>
                </div>

                <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>

                <p className='text-slate-500 mt-1 font-semibold'> $
                    {listing.offer
                        ? listing.discountPrice.toLocaleString('en-US')
                        : listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' && ' / month'}
                </p>

                <div className="text-slate-700 flex gap-4 ">
                    <div className="font-bold text-xs">
                        {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                    </div>
                    <div className="font-bold text-xs">
                        {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Listingitem