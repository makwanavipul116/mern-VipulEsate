import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = ({ listing }) => {

    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState(false)

    console.log(landlord)
    useEffect(() => {
        const fetchLandloard = async () => {
            try {
                setError(false)
                const res = await fetch(`/api/auth/${listing.userRef}`)
                const data = await res.json()
                if (data.sucess === false) {
                    setError(data.message)
                }
                setError(false)
                setLandlord(data)
            } catch (error) {
                setError(error)
            }
        }

        fetchLandloard()

    }, [listing.userRef])

    console.log(listing)


    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>
                        Contact
                        <span className='font-semibold'> {landlord.username} </span>
                        for
                        <span className='font-semibold'> {listing.name.toLowerCase()}</span>
                    </p>
                    <textarea name="message" id="message" value={message} className='border w-full rounded-lg p-3' placeholder='Enter message...' onChange={(e) => setMessage(e.target.value)} rows="2" />
                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                    >
                        Send Message
                    </Link>

                </div>
            )
            }



        </>
    )
}

export default Contact