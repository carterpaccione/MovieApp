import { ImportMeta } from "../components/header.js";

const apiURL = (import.meta as unknown as ImportMeta).env.VITE_API_BASE_URL;

export const fetchMovieByID = async (imdbID: string) => {
  try {
    const response = await fetch(`${apiURL}/api/movies/${imdbID}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
  }
};

interface NewUserInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const validateNewUserInput = (input: NewUserInput) => {
  if (input.email.length === 0 || !input.email.includes("@")) {
    return "Invalid email";
  } else if (input.username.length === 0) {
    return "Username cannot be empty";
  } else if (input.password.length < 8) {
    return "Password must be at least 8 characters";
  } else if (input.password !== input.confirmPassword) {
    return "Passwords do not match";
  } else {
    return true;
  }
};
