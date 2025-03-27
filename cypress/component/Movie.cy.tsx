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
import Movie from "../../client/src/pages/Movie";
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

Cypress.Commands.add("mountWithApollo", (component: React.ReactNode) => {
  cy.mount(<ApolloProvider client={client}>{component}</ApolloProvider>);
});

describe("<Movie />", () => {
  it("renders the movie page", () => {
    cy.mountWithApollo(
      <MemoryRouter>
        <Header />
        <Movie />
      </MemoryRouter>
    );
  });
});
