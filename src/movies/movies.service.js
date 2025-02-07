const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  // TODO: Add your code here
  return db("movies").select("*").where({ movie_id: movie_id }).first();
}

async function listTheartersByMovie(movieId) {
  return db("theaters as t")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .where({ "mt.movie_id": movieId });
}

async function listReviewsByMovie(movieId) {
  return db("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at as review_created_at",
      "r.updated_at as review_updated_at",
      "r.critic_id",
      "r.movie_id",
      "c.critic_id as critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
      "c.created_at as critic_created_at",
      "c.updated_at as critic_updated_at"
    )
    .where({ "r.movie_id": movieId });
}

module.exports = {
  list,
  read,
  listTheartersByMovie,
  listReviewsByMovie,
};
