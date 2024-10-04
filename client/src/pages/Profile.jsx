import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { userUpdateStart, userUpdateSuccess, userUpdateFailuar, signOutFailuar, signOutStart, signOutSuccess, userDeleteStart, userDeleteFailuar, userDeleteSuccess } from '../redux/users/userSlices'
import { Link } from 'react-router-dom'

const Profile = () => {
    const { currentUser, loading, error } = useSelector((state) => state.user)
    const fileRef = useRef()
    const [file, setFile] = useState(undefined)
    const [filePercentage, setFilePercentage] = useState(0)
    const [fileUplaodError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    const [userUpdate, setUserUpdate] = useState(false)
    const [ShowListingError, setShowListingError] = useState(false)
    const [userListing, setUserListing] = useState([])


    const dispatch = useDispatch()

    useEffect(() => {
        if (file) {
            handleFileUpload(file)
        }
    }, [file])

    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setFilePercentage(Math.round(progress))
            },

            (error) => {
                setFileUploadError(true)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadURL) => {
                        setFormData({ ...formData, profilePicture: downloadURL })
                    }
                )
            }
        )

    }

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(userUpdateStart())
            const res = await fetch(`/api/auth/update/${currentUser._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            )
            const data = await res.json()
            if (data.success === false) {
                setUserUpdate(false)
                dispatch(userUpdateFailuar(data.message))
                return
            }
            dispatch(userUpdateSuccess(data))
            setUserUpdate(true)
        } catch (error) {
            dispatch(userUpdateFailuar(error))
        }
    }

    const handleDelete = async () => {
        try {
            dispatch(userDeleteStart())
            const res = await fetch(`/api/auth/delete/${currentUser._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(userDeleteFailuar(data.message))
                return
            }
            dispatch(userDeleteSuccess(data))
        } catch (error) {
            dispatch(userDeleteFailuar(error))
        }
    }

    const handleSignOut = async () => {
        try {
            dispatch(signOutStart())
            const res = await fetch('/api/user/sign-out')
            const data = await res.json()
            if (data.success === false) {
                dispatch(signOutFailuar(data.message))
                return
            }
            dispatch(signOutSuccess(data))
        } catch (error) {
            dispatch(signOutFailuar(error))
        }
    }

    const handleShowListing = async () => {
        try {
            setShowListingError(false)
            const res = await fetch(`/api/auth/listings/${currentUser._id}`)
            const data = await res.json()
            if (data.success === false) {
                setShowListingError(data.message)
                return
            }
            console.log(data)
            setUserListing(data)
        } catch (error) {
            setShowListingError(error)
        }
    }

    const handleDeleteListing = async (listid) => {
        try {
            const res = await fetch(`/api/listing/delete/${listid}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if (data.success === false) {
                setShowListingError(data.message)
            }

        } catch (error) {
            setShowListingError(error)
        }
    }

    return (
        <div className='p-3 max-w-xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-4 text-slate-700'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>

                <input type="file" accept='image/*' ref={fileRef} hidden onChange={(e) => setFile(e.target.files[0])} />

                <img src={formData.profilePicture || currentUser.profilePicture} onClick={() => fileRef.current.click()} alt="no_image" className='self-center w-24 h-24 rounded-full object-cover' />
                <p className='text-xs m-[-5px] p-0  text-center'>Click to change profile</p>
                <p className='self-center text-sm'>
                    {
                        fileUplaodError ?
                            (<span className='text-red-700 '>Error in uploading(file must be less than 2mb)</span>)
                            :
                            filePercentage > 0 && filePercentage < 100 ?
                                (<span className='text-slate-700-700 text-sm'>{`Uploading ${filePercentage} %`} </span>)
                                : filePercentage === 100 ?
                                    (<span className='text-green-700 text-sm'>Image Uploaded SuccessFully</span>)
                                    : ""
                    }
                </p>

                <input type="text" defaultValue={currentUser.username} id="username" placeholder='username' className='border p-3 rounded-lg' onChange={handleChange} />

                <input type="email" defaultValue={currentUser.email} id="email" placeholder='email' className='border p-3 rounded-lg' onChange={handleChange} />

                <input type="text" id="password" placeholder='password' className='border p-3 rounded-lg' onChange={handleChange} />

                <button disabled={loading} className='uppercase text-white bg-slate-800 p-3 rounded-lg hover:opacity-90 disabled:opacity-80'>{loading ? "Loading..." : "Update"}</button>
                <Link to='/create' className="text-white bg-green-700 p-3 rounded-lg text-center hover:opacity-95">Create Listing</Link>

            </form>
            <p className='flex justify-between p-1'>
                <span className='text-red-700 cursor-pointer' onClick={handleDelete} >Delete an account</span>
                <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>SignOut</span>
            </p>

            <p className='text-center my-2'>
                <span className='text-red-700'>{error ? error : ""}</span>
                <span className='text-green-700'>{userUpdate && "User Updated SuccessFully"}</span>
            </p>

            <button onClick={handleShowListing} className='text-green-700 w-full'>Show Listing</button>
            <p className='text-center my-2'>
                <span className='text-red-700'>{ShowListingError ? ShowListingError : ""}</span>
            </p>

            {userListing && userListing.length > 0 &&
                <div className='flex flex-col gap-3 p-1'>
                    <h1 className='text-center font-semibold text-2xl mt-5'>Your Listing</h1>

                    {userListing.map((listing, index) =>
                        <div className='flex items-center justify-between border gap-4 p-2' key={index}>

                            <Link to={`/listing/${listing._id}`}>
                                <img src={listing.imageUrls[0]} alt='listing image' className=' w-16 h-16 rounded-lg object-contain' />
                            </Link>


                            <Link className='text-slate-700 truncate font-semibold hover:underline flex-1' to={`/listing/${listing._id}`}>
                                <p>{listing.name}</p>
                            </Link>

                            <div className="flex flex-col items-center ">
                                <button onClick={() => handleDeleteListing(listing._id)} className='text-red-700 uppercase hover:underline'>DELETE</button>
                                <Link to={`/edit-listing/${listing._id}`}><button className='text-green-700 uppercase hover:underline'>Edit</button></Link>
                            </div>

                        </div>

                    )}
                </div>
            }

        </div>
    )
}

export default Profile