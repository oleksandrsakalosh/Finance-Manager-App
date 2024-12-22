import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isAuthenticated = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return false;
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if the token has expired
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem("token");
            return false;
        }

        return true;
    } catch (error) {
        console.error("Invalid token", error);
        return false;
    }
};

const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
