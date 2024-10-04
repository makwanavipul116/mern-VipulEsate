import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Listingitem from './Listingitem';

const Search = () => {

    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)

    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    })

    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl

        ) {
            setSideBarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            })
        }


        const fetchListings = async () => {
            setLoading(true)
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (!data.success) {
                setLoading(false)
                console.log(data.message)
            }
            if (data.length > 8) {
                setShowMore(true)
            } else {
                setShowMore(false)
            }
            setListings(data)
            setLoading(false)
        }

        fetchListings()

    }, [location.search])


    const onChangeData = (e) => {

        if (e.target.id === 'searchTerm') {
            setSideBarData({ ...sideBarData, searchTerm: e.target.value })
        }

        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSideBarData({ ...sideBarData, type: e.target.id })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSideBarData({ ...sideBarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false, })
        }


        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at'
            const order = e.target.value.split('_')[1] || 'desc'
            setSideBarData({ ...sideBarData, sort, order })
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm);
        urlParams.set('type', sideBarData.type);
        urlParams.set('parking', sideBarData.parking);
        urlParams.set('furnished', sideBarData.furnished);
        urlParams.set('offer', sideBarData.offer);
        urlParams.set('sort', sideBarData.sort);
        urlParams.set('order', sideBarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);

    }

    const showMoreClick = async () => {
        const numberOfListings = listings.length
        const startIndex = numberOfListings

        const urlParams = new URLSearchParams(location.search)
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString()

        console.log(searchQuery)
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json()
        if (data.length < 9) {
            setShowMore(false)
        }
        setListings([...listings, ...data])
        console.log(listings)

    }


    return (

        <div className='flex flex-col  md:flex-row'>

            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className=' flex flex-col gap-8' >

                    <div className="flex items-center gap-2 flex-nowrap">
                        <label className='whitespace-nowrap font-semibold'> Search Term :</label>
                        <input type="text" id="searchTerm" placeholder='Search....' className='border rounded-lg p-3 w-full' value={sideBarData.searchTerm} onChange={onChangeData} />
                    </div>

                    <div className="flex gap-2 items-center flex-wrap whitespace-nowrap ">
                        <label className='font-semibold'>Type : </label>

                        <div className="flex gap-2">
                            <input type="checkbox" id="all" className='w-5' checked={sideBarData.type === 'all'} onChange={onChangeData} />
                            <span>Rent & Sale </span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className='w-5' checked={sideBarData.type === 'sale'} onChange={onChangeData} />
                            <span> Sale</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className='w-5' checked={sideBarData.type === 'rent'} onChange={onChangeData} />
                            <span> Rent</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className='w-5' checked={sideBarData.offer} onChange={onChangeData} />
                            <span> Offer</span>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center flex-wrap whitespace-nowrap ">
                        <label className='font-semibold'>Amenities : </label>

                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className='w-5' checked={sideBarData.parking} onChange={onChangeData} />
                            <span>Parking </span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className='w-5' checked={sideBarData.furnished} onChange={onChangeData} />
                            <span> Furnished</span>
                        </div>

                    </div>

                    <div className="flex gap-2 items-center">
                        <label className='font-semibold'>Sort : </label>
                        <select id='sort_order' className='border p-3 rounded-lg ' defaultValue={'created_at_desc'} onChange={onChangeData}>
                            <option value="regularPrice_desc">Price High To Low</option>
                            <option value="regularPrice_asc">Price Low To High</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>


                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
                </form>
            </div>

            <div className='flex-1'>
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                    Listing Results:
                </h1>
                <div className="flex flex-wrap p-4 gap-4">
                    {!loading && listings.length < 1 && (
                        <p className='w-full text-center text-2xl font-semibold text-slate-700'>Items Not Found</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>
                            Loading...
                        </p>
                    )}


                    {
                        !loading && listings && listings.map((listing) =>
                            (<Listingitem key={listing._id} listing={listing} />)
                        )
                    }
                    {showMore && (
                        <button onClick={showMoreClick} className='text-green-700 text-center w-full p-7 hover:underline'>ShowMore</button>
                    )}
                </div>

            </div>
        </div >

    )
}

export default Search
