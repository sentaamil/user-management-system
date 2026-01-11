describe('User Management System - UI Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForUserList();
  });

  it('should load the application successfully', () => {
    cy.get('[data-cy="app"]').should('be.visible');
    cy.contains('User Management System').should('be.visible');
  });

  it('should display the add user button', () => {
    cy.get('[data-cy="add-user-btn"]').should('be.visible');
    cy.get('[data-cy="add-user-btn"]').should('contain', 'Add User');
  });

  it('should display search and filter controls', () => {
    cy.get('[data-cy="search-input"]').should('be.visible');
    cy.get('[data-cy="filter-role"]').should('be.visible');
    cy.get('[data-cy="filter-status"]').should('be.visible');
  });

  it('should display user count', () => {
    cy.get('[data-cy="user-count"]').should('be.visible');
    cy.get('[data-cy="user-count"]').should('contain', 'Showing');
  });

  it('should display user list', () => {
    cy.get('[data-cy="user-list"]').should('be.visible');
    cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);
  });

  it('should display user information in cards', () => {
    cy.get('[data-cy="user-card"]').first().within(() => {
      cy.get('[data-cy="user-name"]').should('be.visible');
      cy.get('[data-cy="user-email"]').should('be.visible');
      cy.get('[data-cy="user-status"]').should('be.visible');
      cy.get('[data-cy="user-role"]').should('be.visible');
      cy.get('[data-cy="edit-user-btn"]').should('be.visible');
      cy.get('[data-cy="delete-user-btn"]').should('be.visible');
    });
  });
});