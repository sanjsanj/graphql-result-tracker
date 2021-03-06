describe("Given I visit the Homepage", () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
  });

  describe("When not signed in", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("Should render correctly", () => {
      cy.contains("Result Tracker");
      cy.contains("Signup");
      cy.contains("Signin");
    });
  });

  describe("When signed in as Bob", () => {
    before(() => {
      cy.get('[href="/signin"]').click();
      cy.contains("Log in to your account");

      cy.get("button").contains("Log in");

      cy.get(':nth-child(1) > fieldset > [for="email"] > input')
        .type("a@a.com")
        .should("have.value", "a@a.com");

      cy.get('[for="password"] > input').type("asdasd");

      cy.get(":nth-child(1) > fieldset > button", { force: true }).click();
    });

    it("Should render correctly", () => {
      cy.contains("Hi, Billy Bob");
      cy.contains("Challenge a friend");
      cy.contains("Sign out");
      cy.get(":nth-child(1) > a");
    });

    it("Should let me click on a teaser and see the full challenge", () => {
      cy.visit("/");
      cy.get(":nth-child(1) > a > h3").click();
      cy.contains("Test Challenge");
      cy.contains("Billy Bob vs Susie Sue");
      cy.contains("First to 3 wins!");
    });

    it("Should let me submit a result", () => {
      cy.visit("/");
      cy.get(":nth-child(1) > a > h3").click();
      cy.get(".unconfirmed-results > p").should("not.exist");
      cy.get("fieldset > button").click();
      cy.get(".unconfirmed-results > p").should("exist");
    });

    it("Should let me delete a result", () => {
      cy.visit("/");
      cy.get(":nth-child(1) > a > h3").click();
      cy.get(".unconfirmed-results > p").should("exist");
      cy.get("p > button").click();
      cy.get(".unconfirmed-results > p").should("not.exist");
    });

    after(() => {
      cy.get("nav > button").click();
    });
  });

  describe("When signed in as Chuck", () => {
    before(() => {
      cy.get('[href="/signin"]').click();
      cy.contains("Log in to your account");

      cy.get("button").contains("Log in");

      cy.get(':nth-child(1) > fieldset > [for="email"] > input')
        .type("c@c.com")
        .should("have.value", "c@c.com");

      cy.get('[for="password"] > input').type("asdasd");

      cy.get(":nth-child(1) > fieldset > button", { force: true }).click();
    });

    it("Should render correctly", () => {
      cy.contains("Hi, Chuck E. Cheese");
      cy.contains("Challenge a friend");
      cy.contains("Sign out");
      cy.get(":nth-child(1) > a");
    });

    it("Should not show me Bob and Sue's challenge teaser", () => {
      cy.get(":nth-child(1) > a > h3").should("not.exist");
    });
  });
});
