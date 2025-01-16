import SignUp from '../components/signup.tsx';
import Login from '../components/login.js'
import { useState } from "react";

const Home = () => {
  const [formState, setFormState] = useState("login");

  return (
    <div>
      <button onClick={() => setFormState("login")}>Login</button>
      <button onClick={() => setFormState("signup")}>Sign Up</button>
      {formState === "login" ? <Login /> : <SignUp />}
    </div>
  );
};

export default Home;
