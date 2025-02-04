import Router from "express";
import { searchMovie, getMovieById } from "../controllers/imdbController.js";

const router = Router();

router.get("/search", searchMovie);

// router.get("/movies/:title", getMovieByTitle);

router.get("/:id", getMovieById);

export default router;