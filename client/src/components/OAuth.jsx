import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess, signInFailuar } from '../redux/users/userSlices'
import { useNavigate } from 'react-router-dom'


const OAuth = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)

            const res = await fetch('/api/user/google', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        name: result.user.displayName,
                        email: result.user.email,
                        photo: result.user.photoURL
                    })
            })

            const data = await res.json()
            if (data.success === false) {
                dispatch(signInFailuar(data))
                return
            }
            dispatch(signInSuccess(data))
            navigate('/')

        } catch (error) {
            console.log("could not continue with google", error)
        }
    }

    return (
        <button type='button' onClick={handleGoogleClick} className='bg-red-800 p-3 rounded-lg text-white hover:opacity-90 uppercase'>Continue With Google</button>
    )
}

export default OAuth