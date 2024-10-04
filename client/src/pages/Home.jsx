import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper'
import 'swiper/css/bundle';
import Listingitem from './Listingitem'

const Home = () => {
    SwiperCore.use([Navigation, Autoplay])
    const [offerListings, setOfferListings] = useState([])
    const [rentListings, setRentListings] = useState([])
    const [saleListings, setSaleListings] = useState([])

    const [loadingOffers, setLoadingOffers] = useState(true)
    const [loadingRent, setLoadingRent] = useState(true)
    const [loadingSale, setLoadingSale] = useState(true)

    useEffect(() => {
        const offerListingsFetch = async () => {
            setLoadingOffers(true);
            try {
                const res = await fetch(`/api/listing/get?offer=true&limit=4`)
                const data = await res.json()
                setOfferListings(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoadingOffers(false);
            }
        }

        const rentListingsFetch = async () => {
            setLoadingRent(true);
            try {
                const res = await fetch(`/api/listing/get?type=rent&limit=4`)
                const data = await res.json()
                setRentListings(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoadingRent(false);
            }
        }

        const saleListingsFetch = async () => {
            setLoadingSale(true);
            try {
                const res = await fetch(`/api/listing/get?type=sale&limit=4`)
                const data = await res.json()
                setSaleListings(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoadingSale(false);
            }
        }

        offerListingsFetch()
        rentListingsFetch()
        saleListingsFetch()
    }, [])


    return (
        <div>
            {/* top */}
            <div className='flex flex-col gap-6 p-24 px-3 max-w-6xl mx-auto'>
                <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
                    Find your next <span className='text-slate-500'>perfect</span>
                    <br />
                    place with ease
                </h1>
                <div className='text-gray-400 text-xs sm:text-sm'>
                    Vipul Estate is the best place to find your next perfect place to
                    live.
                    <br />
                    We have a wide range of properties for you to choose from.
                </div>
                <Link
                    to={'/search'}
                    className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
                >
                    Let's get started...
                </Link>
            </div>

            {/* Swiper */}
            <div className='p-2'>
                {loadingOffers ? (
                    <div className='text-center'>Loading offers...</div>
                ) : (
                    <Swiper navigation autoplay={{ delay: 4000 }}>
                        {offerListings.map((listing) => (
                            <SwiperSlide key={listing._id}>
                                <div className="h-[400px] max-w-7xlxl" style={{ background: `url(${listing.imageUrls}) no-repeat center`, backgroundSize: "cover" }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            {/* Bottom listings and result*/}
            <div className='max-w-6xl mx-auto  flex flex-col gap-8 my-10 p-3'>
                {loadingOffers ? (
                    <div className='text-center'>Loading offers...</div>
                ) : (
                    offerListings.length > 0 && (
                        <div>
                            <div className='my-3'>
                                <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {offerListings.map((listing) => (
                                    <Listingitem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    )
                )}

                {loadingRent ? (
                    <div className='text-center'>Loading rent listings...</div>
                ) : (
                    rentListings.length > 0 && (
                        <div>
                            <div className='my-3'>
                                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {rentListings.map((listing) => (
                                    <Listingitem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    )
                )}

                {loadingSale ? (
                    <div className='text-center'>Loading sale listings...</div>
                ) : (
                    saleListings.length > 0 && (
                        <div>
                            <div className='my-3'>
                                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {saleListings.map((listing) => (
                                    <Listingitem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default Home
