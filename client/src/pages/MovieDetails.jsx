import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MovieDetails = () => {
    const navigate = useNavigate();
    const { movieId } = useParams(); // ✅ FIXED param name
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);

    const { axios, favoriteMovies, fetchFavoriteMovies, user, getToken, image_base_url, shows } = useAppContext();

useEffect(() => {
    if (!movieId) return;

    setLoading(true);
    axios.get(`/api/show/${movieId}`) // ✅ FIXED ENDPOINT
        .then(res => {
            if (res.data.success) {
                setShow({
                    movie: res.data.movie,
                    dateTime: res.data.dateTime
                });
            } else {
                toast.error("Movie not found");
                navigate('/movies');
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("API Error:", err);
            toast.error("Failed to load movie");
            setLoading(false);
        });
}, [movieId, navigate, axios]);


    if (loading) return <Loading />;
    if (!show) return <div className='text-center pt-40 text-3xl'>Movie not found</div>;

    const m = show.movie;
    const liked = favoriteMovies?.some(f => f._id === m._id);

    const handleFavorite = async () => {
        if (!user) return toast.error("Login first ");

        try {
            const token = await getToken();
            const res = await axios.post('/api/user/favorite', 
                { movieId: m._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchFavoriteMovies();
            toast.success(res.data.message || "Saved!");
        } catch {
            toast.error("Try again");
        }
    };

    return (
        <div className='px-6 md:px-16 lg:px-40 pt-20 md:pt-32'>
            <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
                <img src={`${image_base_url}${m.poster_path}`} alt={m.title}
                    className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover' />

                <div className='relative flex flex-col gap-3'>
                    <BlurCircle top="-100px" left="-100px" />
                    <p className='text-primary'>ENGLISH</p>
                    <h1 className='text-4xl font-semibold max-w-96 text-balance'>{m.title}</h1>

                    <div className='flex items-center gap-2 text-gray-300'>
                        <StarIcon className="w-5 h-5 text-primary fill-primary" />
                        {m.vote_average?.toFixed(1)} Rating
                    </div>

                    <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{m.overview}</p>

                    <p>{timeFormat(m.runtime)} • {m.genres?.join(", ")} • {m.release_date?.slice(0, 4)}</p>

                    <div className='flex items-center gap-4 mt-4'>
                        <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 rounded-md font-medium active:scale-95'>
                            <PlayCircleIcon className="w-5 h-5" /> Trailer
                        </button>

                        <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull rounded-md font-medium active:scale-95'>
                            Buy Tickets
                        </a>

                        <button onClick={handleFavorite} className='bg-gray-700 p-2.5 rounded-full active:scale-95'>
                            <Heart className={`w-5 h-5 ${liked ? 'fill-primary text-primary' : 'text-gray-400'}`} />
                        </button>
                    </div>
                </div>
            </div>

            <p className='text-lg font-medium mt-20'>Cast</p>
            <div className='overflow-x-auto no-scrollbar mt-4 pb-4'>
                <div className='flex gap-6 px-4'>
                    {m.casts?.slice(0, 12).map((name, idx) => (
                        <div key={idx} className='text-center min-w-20'>
                            <img
                                src="https://i.imgur.com/2YQ1h.jpg"
                                alt={name}
                                className="rounded-full h-20 w-20 object-cover border-4 border-gray-900 shadow-lg hover:scale-110 transition"
                                loading="lazy"
                            />
                            <p className='text-xs mt-2 text-gray-300 line-clamp-2'>
                                {name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>


           <DateSelect dateTime={show.dateTime} movieId={movieId} />

            <p className='text-lg font-medium mt-20 mb-8'>Similar Movies</p>
            <div className='flex flex-wrap justify-center gap-8'>
                {shows.slice(0,4).map(s => s.movie && (
                    <MovieCard key={s.movie._id} movie={s.movie} />
                ))}
            </div>

            <div className='text-center mt-20'>
                <button onClick={() => { navigate('/movies'); window.scrollTo(0, 0) }}
                        className='px-10 py-3 bg-primary hover:bg-primary-dull rounded-md font-medium'>
                    Show more
                </button>
            </div>
        </div>
    );
};

export default MovieDetails;
