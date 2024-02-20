"use strict";
describe("Login page", () => {
  beforeEach(() => {
    cy.visit("https://born-qa-secret-dusk.herokuapp.com/users/sign_in#/");
  });
  it("User can successfully login using valid credentials", () => {
    cy.get('input[type="email"]').type("qa1@monterail.com");
    cy.get('input[type="password"]').type("123456");
    cy.contains("Log in").click();
    cy.get("body").should("include.text", "Upcoming birthdays");
  });
  it("User can't login using invalid credentials", () => {
    cy.get("#user_email").type("invalid@email.com");
    cy.get("#user_password").type("Invalid_Password");
    cy.get('input[type="submit"]').click();
    cy.url().should("include", "/sign_in");
  });
});

describe("Home page", () => {
  beforeEach(() => {
    cy.visit("https://born-qa-secret-dusk.herokuapp.com/users/sign_in#/");
    cy.get('input[type="email"]').type("qa1@monterail.com");
    cy.get('input[type="password"]').type("123456");
    cy.contains("Log in").click();
  });
  it("User can view each person's profile in the list of upcoming birthdays", () => {
    cy.get('li[ng-repeat = "user in nextBirthdays"]').click();
    cy.url().should("include.text", "/user");
    cy.get("body").should("include.text", "Propositions");
  });
  it("User can view upcoming birthdays for each month", () => {
    cy.get(".birthdaylist_month-link").click();
    cy.get(".js-birthdaylist__month-dropdown").should("be.visible");
  });
  it("User can log out of the app", () => {
    cy.get(".crs-user").click();
    cy.get('[href="/users/sign_out"]').click();
    cy.url().should("include", "/sign_in");
  });
  it("User can edit their own profile", () => {
    cy.get(".crs-user").click();
    cy.get('[href="#/user/me"]').click();
    cy.get(".body").should("contain.text", "Edit profile");
    cy.get('input[ng-model="user.birthday_day"]').clear().type(25);
    cy.get('input[ng-model="user.birthday_month"]').clear().type(02);
    cy.contains("SAVE").click();
    cy.get(".body").should("contain.text", "User profile updated");
  });
  it("Clicking on the logo redirects to the home page", () => {
    cy.get('li[ng-repeat = "user in nextBirthdays"]').click();
    cy.contains("Propositions");
    cy.get(".crs-topbar__logo").click();
    cy.get(".body").should("include.text", "List of birthdays");
  });
});

describe("User profile", () => {
  beforeEach(() => {
    cy.visit("https://born-qa-secret-dusk.herokuapp.com/users/sign_in#/");
    cy.get('input[type="email"]').type("qa1@monterail.com");
    cy.get('input[type="password"]').type("123456");
    cy.contains("Log in").click();
  });
  it("User can add propositions in other users' profile", () => {
    cy.get('li[ng-repeat = "user in nextBirthdays"]').click();
    cy.get('input[ng-model="newProposition.title"]').type(
      "This is a title for a new proposition by Dilnoza Ergasheva"
    );
    cy.get('input[ng-model="newProposition.description"]').type(
      "A small description for my new proposition"
    );
    cy.get('input[ng-model="newProposition.value"]').type(5);
    cy.contains("SAVE");
    cy.get(".body").should(
      "include.text",
      "a new proposition by Dilnoza Ergasheva"
    );
  });
  it("User can vote a proposition", () => {
    cy.get('li[ng-repeat = "user in nextBirthdays"]').click();
    cy.get('[vote="proposition"]')[1].find(".crs-comment__votes--up").click();
    cy.get('[vote="proposition"]')[1]
      .find(".crs-comment__votes")
      .should("have.value", "1");
  });
});
