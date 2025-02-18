import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home.js";
import Discover from "./pages/Discover.js";
import Movie from "./pages/Movie.js";
import MyProfile from "./pages/MyProfile.js";
import UserProfile from "./pages/UserProfile.js";
import UserSearch from "./pages/UserSearch.js";
import IssuePage from "./pages/Issue.js";
import App from "./App.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/discover",
        element: <Discover />,
      },
      {
        path: "/movies/:id",
        element: <Movie />,
      },
      {
        path: "/me",
        element: <MyProfile></MyProfile>,
      },
      {
        path: "/users/:userID",
        element: <UserProfile></UserProfile>,
      },
      {
        path: "/search",
        element: <UserSearch></UserSearch>,
      },
      {
        path: "/report",
        element: <IssuePage></IssuePage>,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<RouterProvider router={router} />);
}
