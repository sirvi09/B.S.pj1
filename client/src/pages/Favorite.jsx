// src/pages/Favorite.jsx
import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'

const Favorite = () => {
    const { favoriteMovies = [] } = useAppContext()

    if (favoriteMovies.length === 0) {
        return (
            <div className='h-screen flex flex-col items-center justify-center gap-4'>
                <h1 className='text-4xl font-bold'>No favorites yet ❤️</h1>
                <p className='text-gray-400'>Click the heart on any movie!</p>
            </div>
        )
    }

    return (
        <div className='relative my-40 mb-60 px-6 md:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
            <BlurCircle top='150px' left='0px' />
            <BlurCircle bottom='50px' right='50px' />

            <h1 className='text-2xl font-bold my-8'>❤️ Your Favorites</h1>
            <div className='flex flex-wrap max-sm:justify-center gap-8'>
                {favoriteMovies.map(movie => (
                    <MovieCard movie={movie} key={movie._id} />
                ))}
            </div>
        </div>
    )
}

export default Favorite