import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    // Refer to https://reactrouter.com/start/data/routing to add more routing configurations. Consider moving to routes.jsx if too verbose.
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
