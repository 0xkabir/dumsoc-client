import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home/Home";
import Main from "../Layouts/Main";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/home',
                element: <Home/>
            }
        ]
    }
])