// controllers/showController.js
import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

export const getNowPlayingMovies = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }
    );

    const movies = response.data.results;
    res.json({ success: true, movies });
  } catch (error) {
    console.error("TMDB Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch movies from TMDB",
    });
  }
};

// API to add a new show to the database
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      const [movieDetailResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: { api_key: process.env.TMDB_API_KEY }
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          params: { api_key: process.env.TMDB_API_KEY }
        })
      ]);

      const movieApiData = movieDetailResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        genres: movieApiData.genres?.map(g => g.name) || [],
        casts: movieCreditsData.cast?.slice(0, 10).map(c => c.name) || [],
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];
    showsInput.forEach(show => {
      const showDate = show.date;

      // FIX: Handle time as array OR string
      const timeArray = Array.isArray(show.time) ? show.time : [show.time];

      timeArray.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movie._id,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {}
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: 'Show added successfully.' });
  } catch (error) {
    console.error("addShow error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    const uniqueMovies = [...new Set(shows.map(show => show.movie._id.toString()))]
      .map(id => shows.find(s => s.movie._id.toString() === id).movie);

    res.json({ success: true, shows: uniqueMovies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get a single show from the database
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() }
    }).sort({ showDateTime: 1 });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({
        time: show.showDateTime.toTimeString().slice(0, 8),
        showId: show._id
      });
    });

    console.log("Shows found (formatted by date):", JSON.stringify(dateTime, null, 2));

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
