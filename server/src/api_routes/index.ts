import dotenv from "dotenv";
import Router from "express";
dotenv.config();

const router = Router();

const API_KEY = process.env.OMDB_API_KEY;
const OMDB_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

router.get("/movies/search", async (req, res) => {
  const { query } = req.query;
  try {
    const response = await fetch(`${OMDB_URL}&s=${query}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error(
      "There was a problem with your fetch operation:",
      error.message
    );
  }
});

// router.get("/movies/:title", async (req, res) => {
//   const { title } = req.params;
//   try {
//     if (!title) {
//       throw new Error("No title provided");
//     }
//     const response = await fetch(`${OMDB_URL}&t=${title}`);
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     res.json(data);
//   } catch (error: any) {
//     console.error(
//       "There was a problem with your fetch operation:",
//       error.message
//     );
//   }
// });

router.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("No title provided");
    }
    const response = await fetch(`${OMDB_URL}&i=${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error(
      "There was a problem with your fetch operation:",
      error.message
    );
  }
});

export default router;
