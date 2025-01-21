import { useState } from "react";
import { useMutation } from "@apollo/client";

import { ADD_RATING } from "../utils/mutations/ratingMutations";

interface ReviewFormProps {
  movieID: string;
}

const ReviewForm = (props: ReviewFormProps) => {
  const [score, setScore] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [addRating] = useMutation(ADD_RATING);

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScore(parseInt(e.target.value));
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await addRating({
        variables: {
          input: {
            movieID: props.movieID,
            score: score,
            review: review,
          },
        },
      });
      console.log(result);
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="rating">Rating:</label>
      <input
        type="number"
        max="10"
        min="1"
        name="score"
        onChange={handleScoreChange}
      />
      <label htmlFor="review">Review:</label>
      <textarea id="review" name="review" onChange={handleReviewChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReviewForm;
