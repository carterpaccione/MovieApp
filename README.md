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

  #### GET /api/movies/search - Search for a movie

  - Query Parameters: 
    - *query* (string) - The movie title to search for.
    - Example: /api/movies/search?query=Inception
  - Response:

  #### GET /api/movies/:id - Get a movie by its IMDB id

  - Query Parameters:
    - *:id* (string) - The movie's IMDB to search by.
    - Example: /api/movies/123
  - Response:

  #### POST /api/recommend

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
  - Response:

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
              title
              imdbID
            }
            status
          }
        }
      }
    - Example Response:

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
              title
              imdbID
            }
            status
          }
        }
      }
    - Example Response:

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
              title
              imdbID
            }
            status
          }
        }
      }
    - Example Response:

  - **setRecommendations** - Set's the AI generated recommendations to the user.
    - Example Request:
      ````
      mutation setRecommendations($input: SetRecsInputWrapper!) {
        setRecommendations(input: $input) {
          _id
          username
          email
          movies {
            movie {
              _id
              title
              imdbID
            }
            status
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
    - Example response:

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
    - Example Response

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

  - **deleteRequest** - Delete an outgoing friend request
    - Example Request:
      ````
      mutation deleteRequest($friendshipID: ID!) {
        deleteRequest(friendshipID: $friendshipID)
      }
    - Example Response:

  - **removeFriend** - Delete a friendship with another user
    - Example Request:
      ````
      mutation removeFriend($friendshipID: ID!) {
        removeFriend(friendshipID: $friendshipID)
      }
    - Example Response:

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

  - **deleteRating** - Deletes a user's rating of a movie
    - Example Request:
      ````
      mutation deleteRating($ratingID: ID!) {
        deleteRating(ratingID: $ratingID) {
          _id
        }
      }
    - Example Response:

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
