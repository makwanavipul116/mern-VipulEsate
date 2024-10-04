import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper'
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa'
import { useSelector } from 'react-redux';
import Contact from '../components/Contact'


SwiperCore.use([Navigation]);

const Listing = () => {
    const [listing, setListing] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [contact, setContact] = useState(false)

    const { listingId } = useParams()
    // SwiperCore.use([Navigation])

    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setError(false)
                setLoading(true)
                const res = await fetch(`/api/listing/get/${listingId}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(data.message)
                    setLoading(false)
                } else {
                    // Ensure all boolean fields are set to either true or false
                    const cleanedData = {
                        ...data,
                        parking: !!data.parking,
                        furnished: !!data.furnished,
                        offer: !!data.offer
                    }
                    setError(false)
                    setLoading(false)
                    setListing(cleanedData)

                }
            } catch (error) {
                setError("Failed to fetch listing data")
                setLoading(false)
            }
        }

        fetchListing()
    }, [listingId])

    return (
        <main>
            {loading && <p className='text-3xl font-semibold text-center my-7'>Loading...</p>}
            {error && <p className='text-3xl font-semibold text-center text-red-700 my-7'>{error}</p>}
            {
                listing && !loading && !error &&
                <div>
                    <div className="p-0">
                        <Swiper navigation autoplay={{ delay: 4000 }} >
                            {listing.imageUrls.map((url, index) => (
                                <SwiperSlide key={index}>
                                    <div className="h-[400px] " style={{ background: `url(${url}) no-repeat center `, backgroundSize: "cover" }}></div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="flex flex-col max-w-4xl mx-auto p-3 my-4 gap-4">

                        <p className='text-2xl font-semibold'>
                            {listing.name} - ${' '}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                        </p>

                        <p className='flex items-center mt-3 gap-2 text-slate-600  text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>

                        <div className="flex gap-4">
                            <p className='bg-red-900 w-full max-w-[200px] text-center p-1 rounded-md text-white '>
                                {listing.type === 'rent' ? 'For rent' : 'For sale'}
                            </p>
                            {listing.offer &&
                                <p className='bg-green-900 text-white text-center w-full max-w-[200px] rounded-md p-1'>
                                    ${+listing.regularPrice - +listing.discountPrice} Off
                                </p>
                            }
                        </div>
                        <p className='text-slat-800 '>
                            <span className=' text-black font-semibold'>Description - </span>
                            {listing.description}
                        </p>

                        <ul className='flex gap-4 sm:gap-6 flex-wrap items-center text-green-700 font-semibold text-sm'>
                            <li className='flex gap-1 items-center whitespace-nowrap'>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                            </li>
                            <li className='flex gap-1 items-center whitespace-nowrap'>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                            </li>
                            <li className='flex gap-1 items-center whitespace-nowrap'>
                                <FaParking className='text-lg' />
                                {listing.parking ? `Parking spot` : `No parking`}
                            </li>
                            <li className='flex gap-1 items-center whitespace-nowrap'>
                                <FaChair className='text-lg' />
                                {listing.furnished ? `Furnished` : `Unfurnished`}
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact && (<button onClick={() => setContact(true)} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 font-semibold'>Contact landlord</button>)}
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            }
        </main >
    )
}

export default Listing