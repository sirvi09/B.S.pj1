import React from 'react'
import HeroSection from '../components/HeroSection'
import MovieCard from '../components/MovieCard'
import TrailersSection from '../components/TrailersSection'
import { useAppContext } from '../context/AppContext'

const Home = () => {
    const { shows } = useAppContext()

    const featured = shows.map(s => s.movie).filter(Boolean).slice(0, 6)

    return (
        <>
            <HeroSection />
            
            <div className='px-6 md:px-16 lg:px-40 py-20'>
                <h1 className='text-2xl font-medium mb-8'>Featured Today</h1>
                <div className='flex flex-wrap gap-8 justify-center'>
                    {featured.map(movie => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
            </div>

            <TrailersSection />
        </>
    )
}

export default Home