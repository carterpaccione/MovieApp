import { useQuery } from "@apollo/client";
// import { useNavigate } from "react-router-dom";

import { QUERY_ME } from "../utils/queries/userQueries.js";

const MyProfile = () => {
  const { data, loading, error } = useQuery(QUERY_ME);

  // const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  console.log("Data:", data);

  return (
    <div>
      <h3>{data.me.username}'s Profile</h3>
      <ul>
        {data.me.movies.map((movie: any, index: number) => (
          <li key={index}>
            <p>{movie.movie.title}</p>
            <img src={movie.movie.poster}></img>
            <p>Status: {movie.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProfile;
