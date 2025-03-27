import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import Header from "../../client/src/components/header";
import Home from "../../client/src/pages/Home";
import UserContext from "../fixtures/userContext.json";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  localStorage.setItem("user", JSON.stringify(UserContext.user));
  localStorage.setItem("id_token", UserContext.id_token);
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

Cypress.Commands.add('mountWithApollo', (component: React.ReactNode) => {
    cy.mount(
        <ApolloProvider client={client}>
        {component}
        </ApolloProvider>
    );
});

describe("<Home/>", () => {
  it("renders the home page", () => {
    cy.mountWithApollo(
        <MemoryRouter>
            <Header />
            <Home />
        </MemoryRouter>
    );
  });

  beforeEach(() => {
    cy.mountWithApollo(
        <MemoryRouter>
            <Header />
            <Home />
        </MemoryRouter>
    )
  });

  it("renders the login form", () => {
    cy.get("#form-container").should("exist");
    cy.get("#form-container").children().should("have.text", "UsernamePassword");
  });

  it("renders the signup form when the 'Sign Up' button is clicked", () => {
    cy.get(`button[id="signup-button"]`).should("exist").click();
    cy.get("#form-container").children().should("have.text", "EmailUsernamePasswordPassword");
  })
});
