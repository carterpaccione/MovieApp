import Card from "react-bootstrap/Card";
import "../styles/movieCard.css";

interface IMovieCardProps {
  movie: {
    Title: string;
    Year?: string;
    Poster: string;
    imdbID: string;
    averageRating?: number;
  };
  onClick: () => void;
}

const MovieCard: React.FC<IMovieCardProps> = ({
  movie,
  onClick,
}: IMovieCardProps) => {
  return (
    <Card className="movie-card-test" onClick={onClick}>
      <Card.Img src={movie.Poster} alt={movie.Title} />
      <div className="movie-card-text-container">
        <Card.Title className="movie-card-text">{movie.Title}</Card.Title>
        <Card.Text className="movie-card-text">{movie.Year}</Card.Text>
        {movie.averageRating && (
          <Card.Text className="movie-card-text">
            Avg Rating: {movie.averageRating}
          </Card.Text>
        )}
      </div>
    </Card>
  );
};

export default MovieCard;
