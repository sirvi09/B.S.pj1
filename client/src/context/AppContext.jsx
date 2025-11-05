import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(null);  // null = loading
    const [shows, setShows] = useState([]);
    const [favouriteMovies, setFavoriteMovies] = useState([]);

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const { user } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchIsAdmin = async () => {
        try {
            const { data } = await axios.get('/api/admin/is-admin', {  // Fixed: /is-admin
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            setIsAdmin(data.isAdmin);

            if (!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/');
                toast.error('You are not authorized to access admin dashboard');
            }
        } catch (error) {
            console.error("fetchIsAdmin error:", error);
            setIsAdmin(false);
        }
    };

const fetchShows = async () => {
    try {
        const { data } = await axios.get('/api/show/all');
        if (data.success) {
            const wrapped = data.shows.map(m => ({ movie: m }));
            setShows(wrapped);
        } else {
            setShows([]);
        }
    } catch (err) {
        setShows([]);
    }
};

    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setFavoriteMovies(data.movies);
            }
        } catch (error) {
            console.error("fetchFavoriteMovies error:", error);
        }
    };

    useEffect(() => {
        fetchShows();
    }, []);

    useEffect(() => {
        if (user) {
            fetchIsAdmin();
            fetchFavoriteMovies();
        } else {
            setIsAdmin(false);
        }
    }, [user]);

   const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoriteMovies: favouriteMovies,  
    fetchFavoriteMovies,
    image_base_url
};

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);