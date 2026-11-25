describe("CampusSync second release", () => {
  it("supports public listing, authentication, complete event CRUD, profile update, search, ownership, and sign out", () => {
    cy.visit("/");
    cy.contains("h1", "Campus plans,").should("be.visible");
    cy.contains("Web Development Study Group").should("be.visible");
    cy.contains("3 upcoming events").should("be.visible");
    cy.screenshot("01-public-home-with-events", { capture: "viewport" });

    cy.contains("a", "Create account").first().click();
    cy.location("pathname").should("eq", "/register");
    cy.get("#register-name").type("Cypress Student");
    cy.get("#register-email").type("cypress.student@campussync.local");
    cy.get("#register-password").type("Cypress123!");
    cy.get("#register-confirm").type("Cypress123!");
    cy.get("form").contains("button", "Create account").click();

    cy.location("pathname").should("eq", "/events");
    cy.contains("Welcome, Cypress Student").should("be.visible");
    cy.contains("My Profile").should("be.visible");
    cy.contains("Sign Out").should("be.visible");

    cy.contains("a", "Add event").first().click();
    cy.get("#title").type("Cypress Testing Workshop");
    cy.get("#category").select("Workshop");
    cy.get("#location").type("Progress Campus Room A102");
    cy.get("#date").type("2026-12-20");
    cy.get("#startTime").type("13:30");
    cy.get("#description").type("Learn browser testing with a complete CampusSync user workflow.");
    cy.contains("button", "Create event").click();

    cy.contains("h1", "Cypress Testing Workshop").should("be.visible");
    cy.contains("Progress Campus Room A102").should("be.visible");
    cy.screenshot("02-event-created", { capture: "viewport" });

    cy.contains("a", "Edit event").click();
    cy.get("#location").clear().type("Progress Campus Room B204");
    cy.get("#description").clear().type("Updated browser testing workshop with CRUD verification for Project Part 2.");
    cy.contains("button", "Save changes").click();
    cy.contains("Progress Campus Room B204").should("be.visible");
    cy.contains("Updated browser testing workshop").should("be.visible");
    cy.screenshot("03-event-updated", { capture: "viewport" });

    cy.contains("a", "My Profile").click();
    cy.location("pathname").should("eq", "/profile");
    cy.get("#profile-name").clear().type("Cypress Updated Student");
    cy.contains("button", "Update profile").click();
    cy.contains("Profile updated.").should("be.visible");
    cy.contains("a", "Events").click();
    cy.contains("Welcome, Cypress Updated Student").should("be.visible");

    cy.contains("h2", "Cypress Testing Workshop").click();
    cy.contains("button", "Delete").click();
    cy.get('[role="alertdialog"]').contains("button", "Delete event").click();
    cy.location("pathname").should("eq", "/events");
    cy.contains("Cypress Testing Workshop").should("not.exist");

    cy.contains("button", "Sign Out").click();
    cy.location("pathname").should("eq", "/");
    cy.contains("a", "Log in").should("be.visible");
    cy.screenshot("04-signed-out-home", { capture: "viewport" });

    cy.contains("a", "Log in").click();
    cy.get("#login-email").type("demo@campussync.local");
    cy.get("#login-password").type("Campus123!");
    cy.contains("button", "Log in").click();
    cy.location("pathname").should("eq", "/events");

    cy.get('input[placeholder="Search title, description, or location"]').type("study");
    cy.contains("Showing 1 of 3 events").should("be.visible");
    cy.contains("Web Development Study Group").should("be.visible");
    cy.screenshot("05-event-search", { capture: "viewport" });

    cy.get('input[placeholder="Search title, description, or location"]').clear();
    cy.contains("h2", "Friendly Basketball Session").click();
    cy.contains("Only the organizer can edit or delete this event.").should("be.visible");
    cy.contains("a", "Edit event").should("not.exist");
    cy.contains("button", "Delete").should("not.exist");
    cy.screenshot("06-ownership-protection", { capture: "viewport" });
  });
});
