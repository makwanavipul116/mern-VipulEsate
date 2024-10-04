import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signInFailuar, signInStart, signInSuccess } from '../redux/users/userSlices'
import OAuth from '../components/OAuth'

const Signin = () => {
    const [formData, setFormData] = useState({})
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.user)

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(signInStart())
            const res = await fetch('/api/user/sign-in', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(signInFailuar(data))
                return
            }
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            dispatch(signInFailuar(error))
        }
    }



    return (
        <div className='p-3 max-w-xl mx-auto'>

            <h1 className='font-bold text-4xl text-slate-700 text-center my-7'>Sign In</h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                <input type="email" id="email" placeholder='email' className='rounded-lg p-3 border ' onChange={handleChange} required />

                <input type="password" id="password" placeholder='password' className='rounded-lg p-3 border ' onChange={handleChange} required />

                <button className='p-3 rounded-lg bg-slate-900 text-white uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "Loading..." : "Sign In"}</button>
                <OAuth />

            </form>
            <div className="flex gap-2 my-2">
                <p>Don't Have an acoount ?</p>
                <span className='text-blue-700'>
                    <Link to='/sign-up'> Sign Up</Link>
                </span>
            </div>
            <div className="text-center">
                {error && <span className='text-red-500'>{error.message}</span>}
            </div>

        </div>
    )
}

export default Signin