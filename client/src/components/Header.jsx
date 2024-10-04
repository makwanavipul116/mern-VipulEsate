import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <header className='p-3 bg-slate-200 shadow-md'>
            <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto">
                <h1 className='font-bold text-sm sm:text-2xl flex'>
                    <Link to='/'>
                        <span className='text-slate-500'>Vipul</span>
                        <span className='text-slate-700'>Estate</span>
                    </Link>
                </h1>
                <form onSubmit={handleSubmit} className='bg-slate-100 p-2 rounded-lg flex items-center'>


                    <div className='relative flex items-center  '>

                        {/* The Search Icon */}
                        <button type="submit" className='absolute right-3'><FaSearch className='text-slate-700 text-lg' /></button>
                        {/* The Input Field */}
                        <input
                            type="text"
                            placeholder='Search...'
                            value={searchTerm}
                            className='bg-transparent w-32 sm:w-64 focus:outline-none  pr-4 py-2 border rounded-lg'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </div>
                </form>

                <ul className='flex gap-4'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-slate-800 hover:underline'>
                            Home
                        </li>
                    </Link>

                    <Link to='/about'>
                        <li className='hidden sm:inline text-slate-800 hover:underline'>
                            About
                        </li>
                    </Link>

                    <Link to='/profile'>
                        {currentUser ? (
                            <img src={currentUser.profilePicture} alt='profilePicture' className='w-7 h-7 rounded-full object-cover' />
                        ) : (
                            <li className='text-slate-800 hover:underline'>
                                Sign-in
                            </li>
                        )}
                    </Link>
                </ul>
            </div >
        </header >
    );
};

export default Header;
