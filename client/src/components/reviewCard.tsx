import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import "../styles/reviewCard.css";

import { IRating } from "../models/Rating";

interface ReviewCardProps {
  rating: IRating;
  userID?: string;

  userNavigate: () => void;
  deleteButton: () => void;
}

const ReviewCard = (props: ReviewCardProps) => {
  return (
    <Container fluid className="review-card">
      <Row>
        <Col>
          <h4
            id="review-card-username"
            onClick={() => {
              props.userNavigate();
            }}
          >
            {props.rating.user.username}
          </h4>
        </Col>
        <Col>
          <h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
            </svg>
            {props.rating.score}/10
          </h4>
        </Col>
      </Row>
      <Row>
        <p id="review-card-date">
          {new Date(props.rating.createdAt).toLocaleDateString()}
        </p>
      </Row>
      <Row>
        <Col>
          <p>{props.rating.review}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          {props.rating.user._id === props.userID && (
            <Button className="button" title="Delete" onClick={props.deleteButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ReviewCard;
