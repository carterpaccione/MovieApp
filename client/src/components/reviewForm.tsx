import { useState } from "react";
import { useMutation } from "@apollo/client";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Button from "react-bootstrap/Button";

import { ADD_RATING } from "../utils/mutations/ratingMutations";

interface ReviewFormProps {
  movieID: string;
}

const ReviewForm = (props: ReviewFormProps) => {
  const [score, setScore] = useState<number>(1);
  const [review, setReview] = useState<string>("");
  const [addRating] = useMutation(ADD_RATING);

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
            onChange={handleReviewChange}
          />
        </InputGroup>
        <Button type="submit">Submit</Button>
      </Col>
    </Form>
  );
};

export default ReviewForm;
