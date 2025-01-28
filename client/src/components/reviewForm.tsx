import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Button from "react-bootstrap/Button";

import { ADD_RATING } from "../utils/mutations/ratingMutations";

export interface ReviewFormProps {
  movieID: string;
  rating?: {
    score: number;
    review: string;
  }
  handleUserMovieRefetch: () => void;
  handleDBMovieRefetch: () => void;
}

const ReviewForm = (props: ReviewFormProps) => {
  const [score, setScore] = useState<number>(props.rating?.score || 1);
  const [review, setReview] = useState<string>(props.rating?.review || "");
  const [addRating, { error }] = useMutation(ADD_RATING);

  useEffect(() => {
    setScore(props.rating?.score || 1);
    setReview(props.rating?.review || "");
  }, [props.rating]);

  const handleScoreChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
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
      props.handleDBMovieRefetch();
      props.handleUserMovieRefetch();
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Col id="scoreSelector">
        <Form.Label>Rate This Movie: {score}</Form.Label>
        <Form.Range
        min={1}
        max={10}
        step={1}
        value={score}
        onChange={handleScoreChange} 
        />
      </Col>
      <Col id="reviewInput">
        <Form.Label htmlFor="review">Review:</Form.Label>
        <InputGroup>
          <Form.Control
            as="textarea"
            aria-label="With textarea"
            value={review}
            onChange={handleReviewChange}
          />
        </InputGroup>
        {error && <p className="text-danger">{error.message}</p>}
        <Button type="submit">Submit</Button>
      </Col>
    </Form>
  );
};

export default ReviewForm;
