const express = require("express");
const morgan = require("morgan");
const MOVIES = require("./movies.json");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();
//const validTypes = []

app.use(morgan("dev"));
app.use(validateBearerToken);
app.use(helmet());
app.use(cors());

// ROUTES
app.get("/movie", validateBearerToken, handleGetMovie);

//FUNCTIONS
function handleGetGenre(req, res) {
  res.json(MOVIES);
}

function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.statusCode(404).json({ error: "Unauthorized Request" });
  }

  next();
}

function handleGetMovie(req, res) {
  let response = MOVIES;

  if (req.query.genre) {
    response = response.filter((movie) =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }
  if (req.query.country) {
    response = response.filter((movie) =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }
  if (req.query.avg_vote) {
    response = response.filter((movie) =>
      movie.avg_vote.toLowerCase().includes(req.query.avg_vote.toLowerCase())
    );
  }
  res.json(response);
}

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
