import User from '../fixtures/users.json';

describe ("Home Page functionality", () => {
    it("Pings the server", () => { 
        cy.request("http://localhost:3000").then((response) => {
            console.log("Response Received: ", response.status);
        });
    });

    context("Log In / Sign Up", () => {
        beforeEach(() => {
            cy.intercept("POST", "/graphql", (req) => {
                console.log("CYPRESS REQUEST OPERATION: ", req.body.operationName);
                if (req.body.operationName === "login") {
                    req.reply({
                        body: {
                            data: {
                                login: { 
                                    token: "12345",
                                    user: {
                                        _id: User._id,
                                        username: User.username,
                                        email: User.email
                                    }
                                }
                            }
                        }
                    })
                } else if (req.body.operationName === "addUser") {
                    req.reply({
                        body: {
                            data: {
                                addUser: {
                                    token: "12345",
                                    user: {
                                        _id: User._id,
                                        username: User.username,
                                        email: User.email
                                    }
                                }
                            }
                        }
                    })
                }
            })

            cy.visit("http://localhost:3000/")
        });

        it("Shows the correct sign up error messages", () => {
            cy.get(`button[id="signup-button"]`).should("be.visible").click();
            cy.get("#cypress-signup-email").type("test");
            cy.get(`button[id="home-form-submit-button"]`).should("be.visible").click();
            cy.get("#errorMessage").should("have.text", "Invalid email")
            cy.get(`button[id="signup-button"]`).should("be.visible").click();
            cy.get("#cypress-signup-email").type(User.email);
            cy.get("#cypress-signup-username").should("be.visible");
            cy.get(`button[id="home-form-submit-button"]`).should("be.visible").click();
            cy.get("#errorMessage").should("have.text", "Username cannot be empty")
            cy.get("#cypress-signup-username").type(User.username);
            cy.get(`button[id="home-form-submit-button"]`).should("be.visible").click();
            cy.get("#errorMessage").should("have.text", "Password must be at least 8 characters")
            cy.get("#cypress-signup-password").type(User.password);
            cy.get("#cypress-signup-confirm-password").type("test");
            cy.get(`button[id="home-form-submit-button"]`).should("be.visible").click();
            cy.get("#errorMessage").should("have.text", "Passwords do not match")
        });

        it("Signs up a user", () => {
            cy.get(`button[id="signup-button"]`).should("be.visible").click();
            cy.get("#cypress-signup-email").type(User.email);
            cy.get("#cypress-signup-username").type(User.username);
            cy.get("#cypress-signup-password").type(User.password);
            cy.get("#cypress-signup-confirm-password").type(User.password);
            cy.get(`button[id="home-form-submit-button"]`).should("be.visible").click();
            cy.location("pathname").should("eq", "/discover")
        });

        it("Logs in a user", () => {
            cy.get("#cypress-login-username").type(User.username);
            cy.get("#cypress-login-password").type(User.password);
            cy.get(`button[id="home-form-submit-button"]`).should("be.visible").click();
            cy.location("pathname").should("eq", "/discover")
        });
    })
})