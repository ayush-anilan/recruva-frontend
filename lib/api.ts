import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api", // Use the environment variable for the API base URL
    timeout: 10000, // Set a timeout for requests (in milliseconds)
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});