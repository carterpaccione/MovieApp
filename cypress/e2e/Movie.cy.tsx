import MovieFixture from "../fixtures/movie.json";
import UserContext from "../fixtures/userContext.json";

describe("Movie Page API Calls", () => {
  it("Pings the server", () => {
    cy.request("http://localhost:3000").then((response) => {
      console.log("Response Received: ", response.status);
    });
  });

  context("Mark Movie As Seen Calls", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/movies/*", {
        statusCode: 200,
        body: MovieFixture.pageMovie,
      }).as("getMovie");

      cy.intercept("POST", "/graphql", (req) => {
        console.log("CYPRESS REQUEST OPERATION: ", req.body.operationName);
        if (req.body.operationName === "movie") {
          req.reply({
            body: {
              data: {
                movie: {
                  ...MovieFixture.pageMovie,
                },
              },
            },
          });
        } else if (req.body.operationName === "saveMovieToDB") {
          req.reply({
            body: {
              data: {
                saveMovieToDB: {
                  ...MovieFixture.saveMovieToDB,
                  user: UserContext.user,
                },
              },
            },
          });
        } else if (req.body.operationName === "userMovieData") {
          req.reply({
            body: {
              data: {
                userMovieData: {
                  ...MovieFixture.userMovieSEEN,
                  user: UserContext.user,
                },
              },
            },
          });
        } else if (req.body.operationName === "addToSeen") {
          req.reply({
            body: {
              data: {
                addToSeen: {
                  ...MovieFixture.addToSeen,
                  user: UserContext.user,
                },
              },
            },
          });
        } else if (req.body.operationName === "addToWatchList") {
          req.reply({
            body: {
              data: {
                addToWatchList: {
                  ...MovieFixture.addToWatchList,
                  user: UserContext.user,
                },
              },
            },
          });
        } else if (req.body.operationName === "removeFromUser") {
          req.reply({
            body: {
              data: {
                removeFromUser: {
                  ...MovieFixture.removeFromUser,
                  user: UserContext.user,
                }
              }
            }
          })
        }
      }).as("movieData");

      cy.visit(`http://localhost:3000/movies/${MovieFixture.pageMovie.imdbID}`);
    });

    it("visits the movie page with the correct data", () => {
      cy.get("h2").should("have.text", MovieFixture.pageMovie.Title);
    });

    it("Mark Seen Button saves the movie to the database and marks the userMovie status as SEEN", () => {
      cy.get("button").contains("Mark Seen").should("be.visible").click();
      cy.wait("@movieData").then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
      });
      cy.get("button").contains("Mark Seen").should("not.exist");
      cy.get("button").contains("Mark Unseen").should("be.visible");
    });

    it("Mark Unseen Button sets the userMovie status to NONE", () => {
      cy.get("button").contains("Mark Unseen").should("be.visible").click();
      cy.wait("@movieData").then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
      });
    })

    // it("Mark Watchlist Button saves the movie to the database and marks the userMovie status as WATCHLIST", () => {
    //   cy.get("button").contains("Mark WatchList").should("be.visible").click();
    //   cy.wait("@movieData").then((interception) => {
    //     expect(interception.response?.statusCode).to.eq(200);
    //   });
    //   cy.get("button").contains("Add to WatchList").should("not.exist");
    //   cy.get("button").contains("Remove From WatchList").should("be.visible");
    // });
  });
});
