import React, { useState, useEffect } from 'react';
import { dummyBookingData, dummyShowsData } from '../../assets/assets';
import Title from '../../components/admin/Title';
import { CheckIcon, StarIcon, X } from 'lucide-react';
import Loading from '../../components/Loading';
import { kConvertor } from '../../lib/kConvertor';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => { 
    const { axios, getToken, user, image_base_url } = useAppContext();

    const currency = import.meta.env.VITE_CURRENCY;
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [showPrice, setShowPrice] = useState("");
    const [addingShow, setAddingShow] = useState(false);  // Fixed: camelCase

    const fetchNowPlayingMovies = async () => {
      try {
        const { data } = await axios.get('/api/show/now-playing', {
          headers: { Authorization: `Bearer ${await getToken()}` }
        });
        if (data.success) {
          setNowPlayingMovies(data.movies);
        }
      } catch (error) {
        console.error("fetchNowPlayingMovies error:", error);
      }
    };

    const handleDateTimeAdd = () => {
      if (!dateTimeInput) return;

      const [date, time] = dateTimeInput.split('T');
      if (!date || !time) return;

      setDateTimeSelection(prev => {
        const times = prev[date] ?? [];
        if (times.includes(time)) return prev;
        return { ...prev, [date]: [...times, time] };
      });

      setDateTimeInput('');
    };

    const handleRemoveTime = (date, time) => {
      setDateTimeSelection((prev) => {
        const filteredTimes = prev[date].filter((t) => t !== time);
        if (filteredTimes.length === 0) {
          const { [date]: _, ...rest } = prev;
          return rest;
        }
        return {
          ...prev,
          [date]: filteredTimes,
        };
      });
    };

const handleSubmit = async () => {
  try {
    setAddingShow(true);

    const token = await getToken();
    if (!token) throw new Error("No token");

    const showsInput = Object.entries(dateTimeSelection).flatMap(([date, times]) =>
      times.map(time => ({ date, time }))
    );

    const { data } = await axios.post('/api/show/add', {
      movieId: selectedMovie,
      showPrice: Number(showPrice),
      showsInput
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (data.success) {
      toast.success("Shows added!");
      setSelectedMovie(null);
      setShowPrice("");
      setDateTimeSelection({});
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed");
  } finally {
    setAddingShow(false);
  }
};
    useEffect(() => {
      if (user) {
        fetchNowPlayingMovies();
      }
    }, [user]);

    return nowPlayingMovies.length > 0 ? (
       <>
       <Title text1="Add" text2="shows" />
       <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
       <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
            {nowPlayingMovies.map((movie) => (
                <div 
                  key={movie.id} 
                  className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`} 
                  onClick={() => setSelectedMovie(movie.id)}
                >
                 <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={`${image_base_url}${movie.poster_path}`} 
                      alt={movie.title} 
                      className="w-full object-cover brightness-90" 
                    />
                    <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                        <p className="flex items-center gap-1 text-gray-400">
                        <StarIcon className="w-4 h-4 text-primary fill-primary" />
                        {movie.vote_average.toFixed(1)}
                        </p>
                        <p className="text-gray-300">{kConvertor(movie.vote_count)} Votes</p>
                       </div>
                </div>
                {selectedMovie === movie.id && (
                    <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                        <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                )}
                <p className="font-medium truncate">{movie.title}</p>
                <p className="text-gray-400 text-sm">{movie.release_date}</p>
             </div>
            ))}
        </div>
        </div>

        {/* Show Price Input */}
        <div className="mt-8">
            <label className="block text-sm font-medium mb-2">Show Price</label>
            <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
                <p className="text-gray-400 text-sm">{currency}</p>
                <input 
                  min={0} 
                  type="number" 
                  value={showPrice} 
                  onChange={(e) => setShowPrice(e.target.value)} 
                  placeholder="Enter show price"
                  className="outline-none bg-transparent" 
                />
            </div>
        </div>
        
        {/* DATETIME PICKER SECTION */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">Select Date and Time</label>

          <div className="inline-flex items-center gap-3 rounded-md border border-gray-600 p-2 bg-black">
            <input
              type="datetime-local"
              value={dateTimeInput}
              onChange={e => setDateTimeInput(e.target.value)}
              className="h-10 w-64 px-3 text-sm text-white bg-black border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min={new Date().toISOString().slice(0, 16)}
              style={{ appearance: 'none', WebkitAppearance: 'none' }}
            />
            <button
              onClick={handleDateTimeAdd}
              className="rounded-lg bg-primary/80 px-3 py-2 text-sm text-white transition hover:bg-primary"
            >
              Add Time
            </button>
          </div>

          {/* Show added times */}
          <div className="mt-4">
            {Object.keys(dateTimeSelection).map(date => (
              <div key={date} className="flex flex-wrap gap-2 mt-2">
                <span className="font-medium">{date}:</span>
                {dateTimeSelection[date].map(time => (
                  <span key={time} className="inline-flex items-center gap-1 bg-primary/10 px-2 py-1 rounded text-xs">
                    {time}
                    <button
                      onClick={() => handleRemoveTime(date, time)}
                      className="ml-1 text-red-500 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={addingShow}
          className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
        >
          {addingShow ? "Adding..." : "Add Show"}
        </button>
       </>
    ) : <Loading />;
};

export default AddShows;