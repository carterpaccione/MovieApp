# <center>Movie App   [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)</center>

## Description

Movie App allows users to search for movies using the OMDb API, mark movies as seen, rate and review movies, and save them to a "Watch List" for later viewing. Users can also get add friends to view their movie catalog and reviews. The app also generates personalized movie recommendations based on the user's own ratings, excluding movies they've marked as seen. Additionally, the "Top 5 Movies" section deisplays the highest-rated movies on the site.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Documentation](#api-documentation)
- [Tests](#tests)
- [Contributing](#contributing)
- [Questions](#questions)
- [Future Improvements](#future-improvements)
- [License](#license)

## Installation

- Local Usage:
  - Set necessary environment variables, npm install, npm run start.
- Deployed Application:
    - TBD

## Features

- User Authentication:
  - Sign up and log in for profile management.
- Movie Search:
  - Search for movies using the OMDb API.
- Save movies to a user with two statuses:
  - SEEN - to indicate that you have seen this film before.
  - WATCH_LIST - to save the film to watch later.
- Rate & Review Movies:
  - Create, Update, and Delete ratings/reviews for each movie saved in our database.
- Add friends and view their movie lists, reviews, and scores.
- AI-Powered Recommendations:
  - Generate a custom recommendation list using your seen and rated movies.
 
## Tech Stack

- Frontend: React, TypeScript, Vite, ReactBootstrap
- Backend: Node.js, Express, Apollo Server, MongoDB, GraphQL
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)
- External API: OMDb API for movie data
- AI Integration: OpenAI API for recommendations

## API Documentation

### External API Routes:

**GET /api/movies/search** - Search for a movie
  - Query Parameters: 
    - *query* (string) - The movie title to search for.
    - Example: /api/movies/search?query=Inception
  - Response Example:
    ```json
      {
        "Search": [
            {
                "Title": "Inception",
                "Year": "2010",
                "imdbID": "tt1375666",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
            },
            {
                "Title": "Inception: The Cobol Job",
                "Year": "2010",
                "imdbID": "tt5295894",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BMjE0NGIwM2EtZjQxZi00ZTE5LWExN2MtNDBlMjY1ZmZkYjU3XkEyXkFqcGdeQXVyNjMwNzk3Mjk@._V1_SX300.jpg"
            },
            {
                "Title": "The Crack: Inception",
                "Year": "2019",
                "imdbID": "tt6793710",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BZTc4MDliNjAtYmU4YS00NmQzLWEwNjktYTQ2MGFjNDc5MDhlXkEyXkFqcGc@._V1_SX300.jpg"
            },
            {
                "Title": "Inception: Jump Right Into the Action",
                "Year": "2010",
                "imdbID": "tt5295990",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BZGFjOTRiYjgtYjEzMS00ZjQ2LTkzY2YtOGQ0NDI2NTVjOGFmXkEyXkFqcGdeQXVyNDQ5MDYzMTk@._V1_SX300.jpg"
            },
            {
                "Title": "Inception: Motion Comics",
                "Year": "2010–",
                "imdbID": "tt1790736",
                "Type": "series",
                "Poster": "https://m.media-amazon.com/images/M/MV5BNGRkYzkzZmEtY2YwYi00ZTlmLTgyMTctODE0NTNhNTVkZGIxXkEyXkFqcGdeQXVyNjE4MDMwMjk@._V1_SX300.jpg"
            },
            {
                "Title": "Inception",
                "Year": "2014",
                "imdbID": "tt7321322",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BOTY3OGFlNTktYTJiZi00ZWMxLTk4MjQtNmJiODkxYThiNjg4XkEyXkFqcGc@._V1_SX300.jpg"
            },
            {
                "Title": "Madness Inception",
                "Year": "2022",
                "imdbID": "tt29258696",
                "Type": "movie",
                "Poster": "N/A"
            },
            {
                "Title": "Inception: 4Movie Premiere Special",
                "Year": "2010",
                "imdbID": "tt1686778",
                "Type": "movie",
                "Poster": "N/A"
            },
            {
                "Title": "Cyberalien: Inception",
                "Year": "2017",
                "imdbID": "tt7926130",
                "Type": "movie",
                "Poster": "N/A"
            },
            {
                "Title": "WWA: The Inception",
                "Year": "2001",
                "imdbID": "tt0311992",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BNTEyNGJjMTMtZjZhZC00ODFkLWIyYzktN2JjMTcwMmY5MDJlXkEyXkFqcGdeQXVyNDkwMzY5NjQ@._V1_SX300.jpg"
            }
        ],
        "totalResults": "38",
        "Response": "True"
    }

**GET /api/movies/:id** - Get a movie by its IMDB id
  - Query Parameters:
    - *:id* (string) - The movie's IMDB to search by.
    - Example: /api/movies/123
  - Response Example:
    ```json
    {
      "Title": "Inception",
      "Year": "2010",
      "Rated": "PG-13",
      "Released": "16 Jul 2010",
      "Runtime": "148 min",
      "Genre": "Action, Adventure, Sci-Fi",
      "Director": "Christopher Nolan",
      "Writer": "Christopher Nolan",
      "Actors": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
      "Plot": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
      "Language": "English, Japanese, French",
      "Country": "United States, United Kingdom",
      "Awards": "Won 4 Oscars. 159 wins & 220 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
      "Ratings": [
          {
              "Source": "Internet Movie Database",
              "Value": "8.8/10"
          },
          {
              "Source": "Rotten Tomatoes",
              "Value": "87%"
          },
          {
              "Source": "Metacritic",
              "Value": "74/100"
          }
      ],
      "Metascore": "74",
      "imdbRating": "8.8",
      "imdbVotes": "2,658,716",
      "imdbID": "tt1375666",
      "Type": "movie",
      "DVD": "N/A",
      "BoxOffice": "$292,587,330",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True"
    }

**POST /api/recommend**
  - Request Body:
    ```json
    {
        "movies": [
          {
            "title": "Movie Title",
            "imdbID": "1234567890",
            "status": "SEEN",
            "rating": {
              "score": 10
            }
          },
          {
            "title": "Movie 2 Title",
            "imdbID": "0987654321",
            "status": "SEEN",
            "rating": {
              "score": 7
            }
          }
        ]
    }

  - Response Example:
    ```json
    {
      "seenMovies": [
        {
            "movie": {
                "title": "Wolfs",
                "imdbID": "tt14257582"
            },
            "status": "SEEN",
            "rating": {
                "score": 10
            }
        },
        {
            "movie": {
                "title": "Interstellar",
                "imdbID": "tt0816692"
            },
            "status": "SEEN",
            "rating": {
                "score": 10
            }
        },
        {
            "movie": {
                "title": "Inception",
                "imdbID": "tt1375666"
            },
            "status": "SEEN",
            "rating": {
                "score": 10
            }
        },
        {
            "movie": {
                "title": "The Matrix",
                "imdbID": "tt0133093"
            },
            "status": "SEEN",
            "rating": {
                "score": 8
            }
        }
      ],
      "parsedResponse": {
        "recommendations": [
            {
                "title": "The Prestige",
                "year": "2006",
                "imdbID": "tt0482571"
            },
            {
                "title": "Eternal Sunshine of the Spotless Mind",
                "year": "2004",
                "imdbID": "tt0338013"
            },
            {
                "title": "Shutter Island",
                "year": "2010",
                "imdbID": "tt1130884"
            }
        ]
      }
    }

### GraphQL Routes:
  - Headers: Authorization: Bearer *token*

  ### User Resolvers:
  #### Queries:
  
  - **me** - Fetches user's profile information.
    - Example Request:
      ````
        query me {
        me {
          _id
          username
          email
          movies {
            movie {
              _id
              title
              imdbID
              poster
              averageRating
            }
            status
            rating {
              score
              review
            }
          }
          friends {
            _id
            username
          }
          recommendedMovies {
            imdbID
            Title
            Year
            Type
            Poster
          }
        }
      }

    - Example Response:
      ```json
      {
        "data": {
            "me": {
                "_id": "67b4c5645ed4539ddfc48be8",
                "username": "TestUser",
                "email": "test@test.com",
                "movies": [
                    {
                        "movie": {
                            "_id": "67b4c5575ed4539ddfc48bcb",
                            "title": "Wolfs",
                            "imdbID": "tt14257582",
                            "poster": "https://m.media-amazon.com/images/M/MV5BNWI2MzdiM2ItMTg2Zi00MTYwLThlZmItM2FkNWI4NjE3ZjRhXkEyXkFqcGc@._V1_SX300.jpg",
                            "averageRating": 7.8,
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "rating": {
                            "score": 10,
                            "review": "",
                            "__typename": "Rating"
                        },
                        "__typename": "UserMovie"
                    },
                    {
                        "movie": {
                            "_id": "67b4c9585ed4539ddfc48d13",
                            "title": "Interstellar",
                            "imdbID": "tt0816692",
                            "poster": "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg",
                            "averageRating": 10,
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "rating": {
                            "score": 10,
                            "review": "",
                            "__typename": "Rating"
                        },
                        "__typename": "UserMovie"
                    },
                    {
                        "movie": {
                            "_id": "67b4c9535ed4539ddfc48cbe",
                            "title": "Inception",
                            "imdbID": "tt1375666",
                            "poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
                            "averageRating": 8,
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "rating": {
                            "score": 10,
                            "review": "",
                            "__typename": "Rating"
                        },
                        "__typename": "UserMovie"
                    },
                    {
                        "movie": {
                            "_id": "67b4c9565ed4539ddfc48ce6",
                            "title": "The Matrix",
                            "imdbID": "tt0133093",
                            "poster": "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg",
                            "averageRating": 8,
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "rating": {
                            "score": 8,
                            "review": "",
                            "__typename": "Rating"
                        },
                        "__typename": "UserMovie"
                    }
                ],
                "friends": [],
                "recommendedMovies": [
                    {
                        "imdbID": "tt0482571",
                        "Title": "The Prestige",
                        "Year": "2006",
                        "Type": "movie",
                        "Poster": "https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_SX300.jpg",
                        "__typename": "MovieSearch"
                    },
                    {
                        "imdbID": "tt0338013",
                        "Title": "Eternal Sunshine of the Spotless Mind",
                        "Year": "2004",
                        "Type": "movie",
                        "Poster": "https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_SX300.jpg",
                        "__typename": "MovieSearch"
                    },
                    {
                        "imdbID": "tt1130884",
                        "Title": "Shutter Island",
                        "Year": "2010",
                        "Type": "movie",
                        "Poster": "https://m.media-amazon.com/images/M/MV5BN2FjNWExYzEtY2YzOC00YjNlLTllMTQtNmIwM2Q1YzBhOWM1XkEyXkFqcGc@._V1_SX300.jpg",
                        "__typename": "MovieSearch"
                    }
                ],
                "__typename": "User"
            }
        }
      }

  - **userRecommendations** - Fetches the saved AI generated recommendations
    - Example Request:
      ````
      query userRecommendations {
        userRecommendations {
          recommendedMovies {
            imdbID
            Title
            Year
            Type
            Poster
          }
        }
      }

    - Example Response:
      ```json
      {
        "data": {
            "userRecommendations": {
                "recommendedMovies": [
                    {
                        "imdbID": "tt0482571",
                        "Title": "The Prestige",
                        "Year": "2006",
                        "Type": "movie",
                        "Poster": "https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_SX300.jpg",
                        "__typename": "MovieSearch"
                    },
                    {
                        "imdbID": "tt0338013",
                        "Title": "Eternal Sunshine of the Spotless Mind",
                        "Year": "2004",
                        "Type": "movie",
                        "Poster": "https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_SX300.jpg",
                        "__typename": "MovieSearch"
                    },
                    {
                        "imdbID": "tt1130884",
                        "Title": "Shutter Island",
                        "Year": "2010",
                        "Type": "movie",
                        "Poster": "https://m.media-amazon.com/images/M/MV5BN2FjNWExYzEtY2YzOC00YjNlLTllMTQtNmIwM2Q1YzBhOWM1XkEyXkFqcGc@._V1_SX300.jpg",
                        "__typename": "MovieSearch"
                    }
                ],
                "__typename": "User"
            }
        }
      }

  - **userByID** - Fetches another user's profile information.
    - Example Request:
      ````
      query userByID($userID: ID!) {
        userByID(userID: $userID) {
          _id
          username
          movies {
            movie {
              _id
              title
              imdbID
              poster
            }
            status
            rating {
              score
              review
            }
          }
          friends {
            _id
            username
          }
        }
      }

    - Example Response:
      ```json
      {
        "data": {
            "userByID": {
                "_id": "67b4c58e5ed4539ddfc48c46",
                "username": "TestTwo",
                "movies": [
                    {
                        "movie": {
                            "_id": "67b4c5575ed4539ddfc48bcb",
                            "title": "Wolfs",
                            "imdbID": "tt14257582",
                            "poster": "https://m.media-amazon.com/images/M/MV5BNWI2MzdiM2ItMTg2Zi00MTYwLThlZmItM2FkNWI4NjE3ZjRhXkEyXkFqcGc@._V1_SX300.jpg",
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "rating": {
                            "score": 10,
                            "review": "",
                            "__typename": "Rating"
                        },
                        "__typename": "UserMovie"
                    }
                ],
                "friends": [],
                "__typename": "User"
            }
        }
      }

  - **userMovieData** - Fetches the relation of the current user to the movie
    - Example Request:
      ````
      query userMovieData($movieID: ID!) {
        userMovieData(movieID: $movieID) {
          movie {
            _id
            title
            imdbID
            averageRating
          }
          status
          rating {
            _id
            score
            review
          }
        }
      }

    - Example Response:
      ```json
      {
        "data": {
            "userMovieData": {
                "movie": {
                    "_id": "67b4c5575ed4539ddfc48bcb",
                    "title": "Wolfs",
                    "imdbID": "tt14257582",
                    "averageRating": 7.8,
                    "__typename": "Movie"
                },
                "status": "SEEN",
                "rating": {
                    "_id": "67b4c5695ed4539ddfc48c01",
                    "score": 10,
                    "review": "",
                    "__typename": "Rating"
                },
                "__typename": "UserMovie"
            }
        }
      }

  - **userListData** - Fetches the current user's Seen and WatchList data
    - Example Request:
      ````
      query userListData {
        userListData {
          movies {
            movie {
              title
              imdbID
            }
            status
            rating {
              score
            }
          }
        }
      }

    - Example Response:
      ```json
      {
        "data": {
            "userListData": {
                "movies": [
                    {
                        "movie": {
                            "title": "Wolfs",
                            "imdbID": "tt14257582",
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "rating": {
                            "score": 10,
                            "__typename": "Rating"
                        },
                        "__typename": "UserMovie"
                    },
                    {
                        "movie": {
                            "title": "Interstellar",
                            "imdbID": "tt0816692",
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "rating": {
                            "score": 10,
                            "__typename": "Rating"
                        },
                        "__typename": "UserMovie"
                    },
                    {
                        "movie": {
                            "title": "Inception",
                            "imdbID": "tt1375666",
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "rating": {
                            "score": 10,
                            "__typename": "Rating"
                        },
                        "__typename": "UserMovie"
                    },
                    {
                        "movie": {
                            "title": "The Matrix",
                            "imdbID": "tt0133093",
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "rating": {
                            "score": 8,
                            "__typename": "Rating"
                        },
                        "__typename": "UserMovie"
                    }
                ],
                "__typename": "User"
            }
        }
      }

  - **searchUsers** - Fetches users in the database based on a query (for finding friends)
    - Example Request:
      ````
      query searchUsers($query: String!) {
        searchUsers(query: $query) {
          _id
          username
        }
      }

    - Example Response:
      ```json
      {
        "data": {
            "searchUsers": [
                {
                    "_id": "67b4c5765ed4539ddfc48c10",
                    "username": "TestUser",
                    "__typename": "User"
                },
                {
                    "_id": "67b4c58e5ed4539ddfc48c46",
                    "username": "TestTwo",
                    "__typename": "User"
                }
            ]
        }
      }

  #### Mutations:
  
  - **addUser** - Creates a new authenticated user
    - Example Request:
      ````
      mutation addUser($input: NewUserInput!) {
        addUser(input: $input) {
          token
          user {
            _id
            username
            email
          }
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "addUser": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoidGVzdFVzZXIiLCJlbWFpbCI6InRlc3RVc2VyQHRlc3QuY29tIiwiX2lkIjoiNjdlNWExZTA3YWVhZDM3YWM0ZGNiNDI5In0sImlhdCI6MTc0MzEwMjQzMiwiZXhwIjoxNzQzMTA5NjMyfQ.Kgh9XjPGXoML-lLIyVx-TYTcsPPAKUxMMBvfFyl8z8Y",
                "user": {
                    "_id": "67e5a1e07aead37ac4dcb429",
                    "username": "testUser",
                    "email": "testUser@test.com",
                    "__typename": "User"
                },
                "__typename": "Auth"
            }
        }
      }

  - **login** - Logs in and authenticates a user
    - Example Request:
      ````
      mutation login($input: LoginUserInput!) {
        login(input: $input) {
          token
          user {
            _id
            username
            email
          }
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "login": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoidGVzdFVzZXIiLCJlbWFpbCI6InRlc3RVc2VyQHRlc3QuY29tIiwiX2lkIjoiNjdlNWExZTA3YWVhZDM3YWM0ZGNiNDI5In0sImlhdCI6MTc0MzEwMjQ5NCwiZXhwIjoxNzQzMTA5Njk0fQ.uWxNKubcq9nF4II1rQSUHqMrIOpH6yEqT78-4DLNNCs",
                "user": {
                    "_id": "67e5a1e07aead37ac4dcb429",
                    "username": "testUser",
                    "email": "testUser@test.com",
                    "__typename": "User"
                },
                "__typename": "Auth"
            }
        }
      }

  - **addToSeen** - Adds a movie to the user's Seen list.
    - Example Request:
      ````
      mutation addToSeen($movieID: ID!) {
        addToSeen(movieID: $movieID) {
          _id
          username
          email
          movies {
            movie {
              _id
            }
            status
          }
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "addToSeen": {
                "_id": "67e5a1e07aead37ac4dcb429",
                "username": "testUser",
                "email": "testUser@test.com",
                "movies": [
                    {
                        "movie": {
                            "_id": "67b4c9585ed4539ddfc48d13",
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "__typename": "UserMovie"
                    }
                ],
                "__typename": "User"
            }
        }
      }

  - **addToWatchList** - Adds a movie to the user's Watch list.
    - Example Request:
      ````
      mutation addToWatchList($movieID: ID!) {
        addToWatchList(movieID: $movieID) {
          _id
          username
          email
          movies {
            movie {
              _id
            }
            status
          }
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "addToWatchList": {
                "_id": "67e5a1e07aead37ac4dcb429",
                "username": "testUser",
                "email": "testUser@test.com",
                "movies": [
                    {
                        "movie": {
                            "_id": "67b4c9585ed4539ddfc48d13",
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "__typename": "UserMovie"
                    },
                    {
                        "movie": {
                            "_id": "67b4c9565ed4539ddfc48ce6",
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "__typename": "UserMovie"
                    },
                    {
                        "movie": {
                            "_id": "67e5a405cb56a10b92e8fe23",
                            "__typename": "Movie"
                        },
                        "status": "WATCH_LIST",
                        "__typename": "UserMovie"
                    }
                ],
                "__typename": "User"
            }
        }
      }

  - **removeFromUser** - Removes a movie from the user.
    - Example Request:
      ````
      mutation removeFromUser($movieID: ID!) {
        removeFromUser(movieID: $movieID) {
          _id
          username
          email
          movies {
            movie {
              _id
            }
            status
          }
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "removeFromUser": {
                "_id": "67e5a1e07aead37ac4dcb429",
                "username": "testUser",
                "email": "testUser@test.com",
                "movies": [
                    {
                        "movie": {
                            "_id": "67b4c9585ed4539ddfc48d13",
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "__typename": "UserMovie"
                    },
                    {
                        "movie": {
                            "_id": "67b4c9565ed4539ddfc48ce6",
                            "__typename": "Movie"
                        },
                        "status": "SEEN",
                        "__typename": "UserMovie"
                    },
                    {
                        "movie": {
                            "_id": "67e5a405cb56a10b92e8fe23",
                            "__typename": "Movie"
                        },
                        "status": "NONE",
                        "__typename": "UserMovie"
                    }
                ],
                "__typename": "User"
            }
        }
      }

  - **setRecommendations** - Set's the AI generated recommendations to the user.
    - Example Request:
      ````
      mutation setRecommendations($input: SetRecsInputWrapper!) {
        setRecommendations(input: $input) {
          _id
          username
          email
          recommendedMovies {
            imdbID
            Title
            Year
            Type
            Poster
          }
        }
      }
    - Example response:
      ```json
      {
        "data": {
            "setRecommendations": {
                "_id": "67e5a7d54dfb32de0157d658",
                "username": "testUser",
                "email": "test@test.com",
                "recommendedMovies": [
                    {
                        "imdbID": "tt1375666",
                        "Title": "Inception",
                        "Year": "2010",
                        "Type": "movie",
                        "Poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
                        "__typename": "MovieSearch"
                    },
                    {
                        "imdbID": "tt0482571",
                        "Title": "The Prestige",
                        "Year": "2006",
                        "Type": "movie",
                        "Poster": "https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_SX300.jpg",
                        "__typename": "MovieSearch"
                    },
                    {
                        "imdbID": "tt3659388",
                        "Title": "The Martian",
                        "Year": "2015",
                        "Type": "movie",
                        "Poster": "https://m.media-amazon.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_SX300.jpg",
                        "__typename": "MovieSearch"
                    }
                ],
                "__typename": "User"
            }
        }
      }

  ### Friendship Resolvers
  #### Queries
  - **friendshipStatus** - Fetch the friendship status between the two users
    - Example Request:
      ````
      query friendshipStatus($userID: ID!) {
        friendshipStatus(userID: $userID) {
        _id
        requester {
            _id
            username
        }
        recipient {
            _id
            username
        }
        status
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "friendshipStatus": {
                "_id": "67e5a9484dfb32de0157d79d",
                "requester": {
                    "_id": "67e5a92d4dfb32de0157d781",
                    "username": "carter",
                    "__typename": "User"
                },
                "recipient": {
                    "_id": "67e5a7d54dfb32de0157d658",
                    "username": "testUser",
                    "__typename": "User"
                },
                "status": "PENDING",
                "__typename": "Friendship"
            }
        }
      }

  - **incomingRequests** - Fetch any incoming friend requests to the current user
    - Example Request:
      ````
      query incomingRequests {
        incomingRequests {
        _id
        requester {
            _id
            username
        }
        recipient {
            _id
            username
        }
        status
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "incomingRequests": [
                {
                    "_id": "67e5a9484dfb32de0157d79d",
                    "requester": {
                        "_id": "67e5a92d4dfb32de0157d781",
                        "username": "carter",
                        "__typename": "User"
                    },
                    "recipient": {
                        "_id": "67e5a7d54dfb32de0157d658",
                        "username": "testUser",
                        "__typename": "User"
                    },
                    "status": "PENDING",
                    "__typename": "Friendship"
                }
            ]
        }
      }

  #### Mutations
  - **addFriend** - Create a new friend request
    - Example Request:
      ````
      mutation addFriend($recipientID: ID!) {
        addFriend(recipientID: $recipientID) {
          _id
          requester {
            _id
          }
          recipient {
            _id
          }
          status
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "addFriend": {
                "_id": "67e5a9484dfb32de0157d79d",
                "requester": {
                    "_id": "67e5a92d4dfb32de0157d781",
                    "__typename": "User"
                },
                "recipient": {
                    "_id": "67e5a7d54dfb32de0157d658",
                    "__typename": "User"
                },
                "status": "PENDING",
                "__typename": "Friendship"
            }
        }
      }

  - **acceptFriend** - Accept / Set friendship status to PENDING on a request
    - Example Request:
      ````
      mutation acceptFriend($friendshipID: ID!) {
        acceptFriend(friendshipID: $friendshipID) {
          _id
          requester {
            _id
            username
          }
          recipient {
            _id
            username
          }
          status
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "acceptFriend": {
                "_id": "67e5a9484dfb32de0157d79d",
                "requester": {
                    "_id": "67e5a92d4dfb32de0157d781",
                    "username": "carter",
                    "__typename": "User"
                },
                "recipient": {
                    "_id": "67e5a7d54dfb32de0157d658",
                    "username": "testUser",
                    "__typename": "User"
                },
                "status": "ACCEPTED",
                "__typename": "Friendship"
            }
        }
      }

  - **rejectFriend** - Reject / Set friendship status to REJECTED on a request
    - Example Request:
      ````
      mutation rejectFriend($friendshipID: ID!) {
        rejectFriend(friendshipID: $friendshipID) {
          _id
          requester {
            _id
            username
          }
          recipient {
            _id
            username
          }
          status
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "rejectFriend": {
                "_id": "67e5aa474dfb32de0157d830",
                "requester": {
                    "_id": "67e5a7d54dfb32de0157d658",
                    "username": "testUser",
                    "__typename": "User"
                },
                "recipient": {
                    "_id": "67e5a92d4dfb32de0157d781",
                    "username": "carter",
                    "__typename": "User"
                },
                "status": "REJECTED",
                "__typename": "Friendship"
            }
        }
      }

  - **deleteRequest** - Delete an outgoing friend request
    - Example Request:
      ````
      mutation deleteRequest($friendshipID: ID!) {
        deleteRequest(friendshipID: $friendshipID)
      }
    - Example Response:
      ```json
      {"data":{"deleteRequest":"67e5a7d54dfb32de0157d658"}}

  - **removeFriend** - Delete a friendship with another user
    - Example Request:
      ````
      mutation removeFriend($friendshipID: ID!) {
        removeFriend(friendshipID: $friendshipID)
      }
    - Example Response:
      ```json
      {"data":{"removeFriend":"67e5a9484dfb32de0157d79d"}}

  ### Movie Resolvers
  #### Queries
  - **movie** - Query a movie in our database
    - Example Request:
      ````
      query movie($imdbID: String!) {
        movie(imdbID: $imdbID) {
          _id
          title
          imdbID
          poster
          averageRating
          ratings {
            _id
            score
            review
            user {
              _id
              username
            }
            createdAt
          }
          averageRating
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "movie": {
                "_id": "67e5a405cb56a10b92e8fe23",
                "title": "The Wild Robot",
                "imdbID": "tt29623480",
                "poster": "https://m.media-amazon.com/images/M/MV5BZWNiZjVlZTUtNGUwYi00MjJmLTg2MDctNWEzYTJiMzY1ODc4XkEyXkFqcGc@._V1_SX300.jpg",
                "averageRating": 10,
                "ratings": [
                    {
                        "_id": "67e5a423cb56a10b92e8fe3f",
                        "score": 10,
                        "review": "This is a review",
                        "user": {
                            "_id": "67e5a1e07aead37ac4dcb429",
                            "username": "testUser",
                            "__typename": "User"
                        },
                        "createdAt": "2025-03-27T19:16:51.437Z",
                        "__typename": "Rating"
                    }
                ],
                "__typename": "Movie"
            }
        }
      }

  - **topMovies** - Query the top 5 highest rated movies within our database
    - Example Request:
      ````
      query topMovies {
        topMovies {
          _id
          title
          imdbID
          poster
          averageRating
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "topMovies": [
                {
                    "_id": "67e5a405cb56a10b92e8fe23",
                    "title": "The Wild Robot",
                    "imdbID": "tt29623480",
                    "poster": "https://m.media-amazon.com/images/M/MV5BZWNiZjVlZTUtNGUwYi00MjJmLTg2MDctNWEzYTJiMzY1ODc4XkEyXkFqcGc@._V1_SX300.jpg",
                    "averageRating": 10,
                    "__typename": "Movie"
                },
                {
                    "_id": "67b4c9585ed4539ddfc48d13",
                    "title": "Interstellar",
                    "imdbID": "tt0816692",
                    "poster": "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg",
                    "averageRating": 10,
                    "__typename": "Movie"
                },
                {
                    "_id": "67b4c9535ed4539ddfc48cbe",
                    "title": "Inception",
                    "imdbID": "tt1375666",
                    "poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
                    "averageRating": 8,
                    "__typename": "Movie"
                },
                {
                    "_id": "67b4c9565ed4539ddfc48ce6",
                    "title": "The Matrix",
                    "imdbID": "tt0133093",
                    "poster": "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg",
                    "averageRating": 8,
                    "__typename": "Movie"
                },
                {
                    "_id": "67b4c5575ed4539ddfc48bcb",
                    "title": "Wolfs",
                    "imdbID": "tt14257582",
                    "poster": "https://m.media-amazon.com/images/M/MV5BNWI2MzdiM2ItMTg2Zi00MTYwLThlZmItM2FkNWI4NjE3ZjRhXkEyXkFqcGc@._V1_SX300.jpg",
                    "averageRating": 7.8,
                    "__typename": "Movie"
                }
            ]
        }
      }

  #### Mutations
  - **saveMovieToDB** - Save the movie to our database if it does not exist so that we can start implementing user data
    - Example Request:
      ````
      mutation saveMovieToDB($input: SaveMovieToDBInput!) {
        saveMovieToDB(input: $input) {
            _id
            imdbID
            title
            poster
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "saveMovieToDB": {
                "_id": "67e5aa944dfb32de0157d86d",
                "imdbID": "tt0258463",
                "title": "The Bourne Identity",
                "poster": "https://m.media-amazon.com/images/M/MV5BYTk1ZTcyMWMtMWUxYS00MmEzLTlmODYtOTk1MGRjOTg1ZjlmXkEyXkFqcGc@._V1_SX300.jpg",
                "__typename": "Movie"
            }
        }
      }
  
  ### Rating Resolvers
  #### Mutations
  - **addRating** - Creates a new rating for a movie from a user / updates if one exists
    - Example Request:
      ````
      mutation addRating($input: RateMovieInput) {
        addRating(input: $input) {
          _id
          score
          review
          createdAt
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "addRating": {
                "_id": "67e5ab214dfb32de0157d87b",
                "score": 7,
                "review": "This movie is good!",
                "createdAt": "2025-03-27T19:46:41.622Z",
                "__typename": "Rating"
            }
        }
      }

  - **deleteRating** - Deletes a user's rating of a movie
    - Example Request:
      ````
      mutation deleteRating($ratingID: ID!) {
        deleteRating(ratingID: $ratingID) {
          _id
        }
      }
    - Example Response:
      ```json
      {
        "data": {
            "deleteRating": {
                "_id": "67e5ab214dfb32de0157d87b",
                "__typename": "Rating"
            }
        }
      }

  ### Issue Resolvers
  - Used for feedback on the application
  #### Mutations
  - **createIssue** - Creates a new suggestion or bug report from a user
    - Example Request:
      ````
      mutation createIssue($description: String!) {
          createIssue(description: $description) {
              _id
              description
          }
      }
  - Example Response:
    ```json
    {
      "data": {
          "createIssue": {
              "_id": "67e5ac424dfb32de0157d894",
              "description": "I found a bug where x should be doing y but instead it's doing z.",
              "__typename": "Issue"
          }
      }
    }

## Tests
#### Cypress

- Component:

  - Header:
    - it renders the header component
    - it should render the proper content
    - it should update the query state
    - it should call the handleSearch function
  - Home:
    - it renders the home page
    - it renders the login form
    - it renders the signup form when the 'Sign Up' button is clicked
  - Movie:
    - it renders the movie page
- E2E:

  - Home:
    - it pings the server
    - it shows the correct sign up error messages
    - it signs up a user
    - it logs in a user
  - Movie:
    - it pings the server
    - it visits the page with the correct data
    - it saves the movie to the database and marks the userMovie status as SEEN
    - it saves the movie to the database and marks the userMovie status as WATCHLIST
   
## Contributing

Carter Paccione

## Questions

For any questions or suggestions, please contact me at: 
carterpaccione@gmail.com.

GitHub: github.com/carterpaccione

## Future Improvements



## License

Distributed under MIT License. See https://choosealicense.com/licenses/mit/ for more information.
