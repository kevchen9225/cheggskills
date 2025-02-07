const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  // TODO: Add your code here.
  const { movieId } = request.params;

  const movie = await service.read(movieId);
  if (movie) {
    response.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: "Movie cannot be found" });
}

async function read(request, response) {
  // TODO: Add your code here
  response.json({ data: response.locals.movie });
}

async function list(request, response) {
  // TODO: Add your code here.
  const { is_showing } = request.query;

  const data = await service.list(is_showing);
  response.json({ data });
}

async function listThearters(request, response, next) {
  const { movieId } = request.params;
  const data = await service.listTheartersByMovie(movieId);
  response.json({ data });
}

async function listReviews(request, response, next) {
  const { movieId } = request.params;
  const reviews = await service.listReviewsByMovie(movieId);

  // Format the data to nest critic details under the `critic` key
  const formattedReviews = reviews.map((review) => ({
    review_id: review.review_id,
    content: review.content,
    score: review.score,
    created_at: review.review_created_at,
    updated_at: review.review_updated_at,
    critic_id: review.critic_id,
    movie_id: review.movie_id,
    critic: {
      critic_id: review.critic_id,
      preferred_name: review.preferred_name,
      surname: review.surname,
      organization_name: review.organization_name,
      created_at: review.critic_created_at,
      updated_at: review.critic_updated_at,
    },
  }));

  response.json({ data: formattedReviews });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  listThearters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listThearters),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
};
