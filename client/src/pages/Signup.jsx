import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

const Signup = () => {
    const [formData, setFormData] = useState({})
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError(false)
            const res = await fetch('/api/user/sign-up', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success === false) {
                setLoading(false)
                setError(data)
            }
            setLoading(false)
            navigate('/sign-in')
            // console.log(data)
        } catch (error) {
            setError(error)
        }

    }



    return (
        <div className='p-3 max-w-xl mx-auto'>

            <h1 className='font-bold text-4xl text-slate-700 text-center my-7'>Sign Up</h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                <input type="text" id="username" placeholder='Username' className='rounded-lg p-3 border ' onChange={handleChange} required />

                <input type="email" id="email" placeholder='email' className='rounded-lg p-3 border ' onChange={handleChange} required />

                <input type="password" id="password" placeholder='password' className='rounded-lg p-3 border ' onChange={handleChange} required />

                <button className='p-3 rounded-lg bg-slate-900 text-white uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "Loading..." : "Sign Up"}</button>
                <OAuth />

            </form>
            <div className="flex gap-2 my-2">
                <p>Have an acoount ?</p>
                <span className='text-blue-700'>
                    <Link to='/sign-in'> Sign In</Link>
                </span>
            </div>
            <p className='text-center'> {error && <span className='text-red-700'>{error.message}</span>}</p>

        </div>
    )
}

export default Signup