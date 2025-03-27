import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Button from "react-bootstrap/Button";

import '../styles/reviewForm.css';

import { ADD_RATING } from "../utils/mutations/ratingMutations";

export interface ReviewFormProps {
  movieID: string;
  rating?: {
    score: number;
    review: string;
  };
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

  const handleScoreChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    setScore(parseInt(e.target.value));
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addRating({
        variables: {
          input: {
            movieID: props.movieID,
            score: score,
            review: review,
          },
        },
      });
      props.handleDBMovieRefetch();
      props.handleUserMovieRefetch();
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Col id="scoreSelector">
        <Form.Label>
          {props.rating ? "Update Rating: " : `Rate this movie: `}
          {score}
        </Form.Label>
        <Form.Range
          min={1}
          max={10}
          step={1}
          value={score}
          onChange={handleScoreChange}
        />
      </Col>
      <Col>
        <Form.Label htmlFor="review">Review:</Form.Label>
        <InputGroup id="reviewInput">
          <Form.Control
            as="textarea"
            aria-label="With textarea"
            value={review}
            onChange={handleReviewChange}
          />
        </InputGroup>
        {error && <p className="text-danger">{error.message}</p>}
        <Button className="button" id="review-form-submit-button" type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        </Button>
      </Col>
    </Form>
  );
};

export default ReviewForm;
