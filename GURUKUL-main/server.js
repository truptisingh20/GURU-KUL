require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" })); // Adjust CORS as needed
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Fetch news from the provided URL
function fetchNews(url, res) {
    axios
        .get(url)
        .then((response) => {
            const { totalResults, results } = response.data;  // Correct the key here
            res.status(200).json({
                message: totalResults > 0 ? "Successfully fetched data" : "No more results to show",
                data: results || [],
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error.response?.data || error.message);
            res.status(500).json({
                message: "Failed to fetch data from the API",
                error: error.message,
            });
        });
}


// Endpoint to fetch top business headlines
app.get('/top-headlines', (req, res) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return res.status(500).json({
            message: "API key is missing in environment variables.",
        });
    }
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=education&country=in&language=en&category=education`;
    fetchNews(url, res);
});

console.log(process.env.API_KEY);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});