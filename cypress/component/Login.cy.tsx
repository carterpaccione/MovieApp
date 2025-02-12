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

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
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
})

describe("<Login />", () => {
  it("renders the login component", () => {
    cy.mountWithApollo(
        <MemoryRouter>
            <Header />
            <Home />
        </MemoryRouter>
    );
  });
});
