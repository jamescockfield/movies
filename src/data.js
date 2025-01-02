const movies = [
    { id: 1, title: "Movie 1", genre: ["action", "adventure"] },
    { id: 2, title: "Movie 2", genre: ["comedy"] },
    { id: 3, title: "Movie 3", genre: ["drama"] }
];

const ratings = [
    { userId: 1, movieId: 1, rating: 5 },
    { userId: 1, movieId: 2, rating: 3 },
    { userId: 2, movieId: 1, rating: 4 }
];

module.exports = { movies, ratings };
