import React, { useEffect } from 'react'
import { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

const UpdateListing = () => {

    const [files, setFiles] = useState({})
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0
    })

    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [listingSuccess, setListingSuccess] = useState(false)


    const { currentUser } = useSelector((state) => state.user)
    const { listingId } = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`/api/listing/get/${listingId}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(data.message)
                } else {
                    // Ensure all boolean fields are set to either true or false
                    const cleanedData = {
                        ...data,
                        parking: !!data.parking,
                        furnished: !!data.furnished,
                        offer: !!data.offer
                    }
                    setFormData(cleanedData)
                }
            } catch (error) {
                setError("Failed to fetch listing data")
            }
        }

        fetchListing()
    }, [listingId])


    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {

            setImageUploadError(false)
            setUploading(true)

            const promises = []

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }

            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })

                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setImageUploadError("Image upload failed (2mb max per image)")
                setUploading(false)
            })
        }
        else {
            setImageUploadError("You can only upload  6 images per listing")
            setUploading(false)
        }
    }

    const storeImage = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                        setImageUploadError(false)
                    } catch (error) {
                        setImageUploadError(true)
                        reject(error);
                    }
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleChange = (e) => {

        if (e.target.id === "rent" || e.target.id === "sell") {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }

        if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if (e.target.type === "text" || e.target.type === "number" || e.target.type === "textarea") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setError(false)
            setListingSuccess(false)
            if (formData.imageUrls.length < 1) return setError("you  must upload  at least one image")
            if (+formData.regularPrice < +formData.discountPrice) return setError("Dicount Price must be lower than  Regular Price")
            setLoading(true)
            const res = await fetch(`/api/listing/update/${listingId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            })

            const data = await res.json()
            setLoading(false)
            if (data.success === false) {
                setListingSuccess(false)
                setLoading(false)
                setError(data.message)
                return
            }
            setError(false)
            setListingSuccess(true)
            navigate(`/listing/${listingId}`)
        } catch (error) {
            setListingSuccess(false)
            setError(error.message)
        }
    }


    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-slate-700 text-center mt-1  my-4'>Update List</h1>

            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className="flex flex-col flex-1 gap-4">
                    <input type="text" id="name" onChange={handleChange} value={formData.name} placeholder='Name' minLength={10} maxLength={60} className='border border-gray-300 rounded-lg p-3' />
                    <textarea type="text" id="description" onChange={handleChange} value={formData.description} placeholder='Description' className='border border-gray-300 rounded-lg p-3' />
                    <input type="text" id="address" onChange={handleChange} value={formData.address} placeholder='Address' className='border border-gray-300 rounded-lg p-3' />

                    <div className="flex gap-6 flex-wrap ">
                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={formData.type === "sell"} id="sell" className='w-5' />
                            <span>Sell</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" onChange={handleChange} checked={formData.type === "rent"} className='w-5' />
                            <span>Rent</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" onChange={handleChange} checked={formData.parking} className='w-5' />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={formData.furnished} id="furnished" className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={formData.offer} id="offer" className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <div className="flex gap-1 items-center ">
                            <input type="number" onChange={handleChange} value={formData.bedrooms} id="bedrooms" min='1' max='10' className='border border-gray-300 rounded-md p-1' />
                            <p>Beds</p>
                        </div>

                        <div className="flex gap-1 items-center ">
                            <input type="number" onChange={handleChange} value={formData.bathrooms} id="bathrooms" min={1} max={10} className='border border-gray-300 rounded-md p-1' />
                            <p>Baths</p>
                        </div>

                        <div className="flex gap-1 items-center ">
                            <input type="number" onChange={handleChange} value={formData.regularPrice} id="regularPrice" min={50} max={100000} className='border border-gray-300 rounded-md p-1' />
                            <div className="flex flex-col  items-center">
                                <p>Regural Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>

                        {
                            formData.offer && (
                                <div className="flex gap-1 items-center ">
                                    <input type="number" onChange={handleChange} value={formData.discountPrice} id="discountPrice" min={0} max={100000} className='border border-gray-300 rounded-md p-1' />
                                    <div className="flex flex-col  items-center">
                                        <p>Discounted Price</p>
                                        <span className='text-xs'>($ / month)</span>
                                    </div>
                                </div>
                            )
                        }

                    </div>

                </div>

                <div className="flex flex-col flex-1 gap-3">
                    <p className='font-semibold'>Image :
                        <span className='font-normal text-gray-600 ml-2'>the first image will be the cover (max 6)</span>
                    </p>


                    <div className="flex gap-4">
                        <input type="file" onChange={(e) => setFiles(e.target.files)} id="image" accept='image/*' multiple className='border border-gray-300 rounded p-3 w-full' />
                        <button type='button' onClick={handleImageSubmit} className='p-3 border border-green-800 hover:shadow-lg rounded'>{uploading ? "Uploading..." : "Upload"}</button>
                    </div>

                    <p className='text-red-700 text-xs'>{imageUploadError && imageUploadError}</p>

                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={index} className='flex justify-between items-center'>
                                <img src={url} alt="listing image" className='w-28 h-28 p-3 border border-gray-300 rounded-lg object-contain hover:opacity-85' />
                                <button type="button" onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 hover:opacity-80 disabled:opacity-70'>DELETE</button>
                            </div>
                        ))
                    }


                    <button disabled={loading || uploading} className='p-3 bg-slate-800 text-white rounded-lg hover:opacity-95 disabled:opacity-80'>{loading || uploading ? "Loading..." : "Update Listing"}</button>

                    {listingSuccess && <p className='text-green-700'>"Update Listing successFully"</p>}
                    {error && <p className='text-red-700'>{error}</p>}
                </div>

            </form>
        </main>
    )
}

export default UpdateListing