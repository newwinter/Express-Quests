require("dotenv").config();
const port = process.env.APP_PORT ?? 5001;

const express = require("express");

const app = express();

app.use(express.json());

// const port = 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favorite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.use(verifyToken);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.post("/api/movies", movieHandlers.postMovie);

const users = require("./users");

app.get("/api/users", users.getUsers);
app.get("/api/users/:id", users.getUsersById);

app.post(
  "/api/login",
  users.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken);
app.post("/api/users", hashPassword, users.postUser);
app.put("/api/users/:id", hashPassword, users.updateUsers);
app.delete("/api/users/:id", users.deleteUsers);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
