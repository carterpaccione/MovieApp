import { MemoryRouter } from "react-router-dom";
import '../support/commands';
import Header from "../../client/src/components/header";

describe("<Header />", () => {
  it("renders the header component", () => {
    cy.mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  });

  it("should render the proper content", () => {
    cy.mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    cy.get("h1").should("have.text", "Movie App");
    cy.get("form").should("have.id", "search-container")
    .children("input")
    .should("have.attr", "placeholder", "Search for a movie...");
    cy.get("button").should("have.id", "search-button");
  });

  it("should update the query state", () => {
    cy.mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    cy.get("input").type("The Matrix");
    cy.get("input").should("have.value", "The Matrix");
  });

  it("should call the handleSearch function", () => {
    cy.mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    cy.get("input").type("The Matrix");
    cy.get(`button[id="search-button"]`).click();
  });
});
