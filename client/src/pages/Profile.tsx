import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { QUERY_ME } from "../utils/queries/userQueries.js";

const MyProfile = () => {
  const { data, loading, error } = useQuery(QUERY_ME);

  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  console.log(data.me);

  return (
    <div>
      <h3>{data.me.username}'s Profile</h3>
      <div>
        {data.me.lists.map((list: any) => (
          <div key={list._id}>
            <h4>{list.name}</h4>
            <ul>
              {list.movies.length ? (
                list.movies?.map((movie: any) => (
                  <li key={movie.imdbID}
                  onClick={() => navigate(`/movie/${movie.imdbID}`)}>
                    <img 
                    src={movie.poster} 
                    alt={movie.title}
                    ></img>
                    {movie.title}
                  </li>
                ))
              ) : (
                <li>No movies found</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProfile;
