import { useLocation, useNavigate } from "react-router-dom";
import { MovieSearch } from "../models/Movie";

import '../styles/discover.css';

const Discover = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const movies = location.state?.movies || [];
    
    return (
        <div className="discover">
            {movies.map((movies: MovieSearch) => (
                <div  className='card 'key={movies.imdbID}>
                    <img src={movies.Poster} alt={movies.Title} />
                    <p>{movies.Title}</p>
                    <p>{movies.Year}</p>
                    <button onClick={() => {navigate(`/movie/${movies.imdbID}`)}}>View Details</button>
                </div>
            ))}
        </div>
    );
}

export default Discover;