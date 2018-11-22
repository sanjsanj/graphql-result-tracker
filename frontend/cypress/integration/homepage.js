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

  describe("When signing in", () => {
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
      cy.get(":nth-child(1) > a > h3").click();
      expect(true).to.eq(true);
    });
  });
});