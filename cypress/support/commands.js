// Custom command to create a user via API
Cypress.Commands.add('createUser', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/users`,
    body: userData,
    failOnStatusCode: false
  });
});

// Custom command to delete a user via API
Cypress.Commands.add('deleteUser', (userId) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/users/${userId}`,
    failOnStatusCode: false
  });
});

// Custom command to get all users via API
Cypress.Commands.add('getAllUsers', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/users`
  });
});

// Custom command to fill user form
Cypress.Commands.add('fillUserForm', (userData) => {
  cy.get('[data-cy="input-firstName"]').clear().type(userData.firstName);
  cy.get('[data-cy="input-lastName"]').clear().type(userData.lastName);
  cy.get('[data-cy="input-email"]').clear().type(userData.email);
  cy.get('[data-cy="input-phone"]').clear().type(userData.phone);
  cy.get('[data-cy="input-role"]').select(userData.role);
  cy.get('[data-cy="input-status"]').select(userData.status);
  cy.get('[data-cy="input-department"]').clear().type(userData.department);
  cy.get('[data-cy="input-location"]').clear().type(userData.location);
});

// Custom command to wait for API response
Cypress.Commands.add('waitForUserList', () => {
  cy.intercept('GET', '**/api/users*').as('getUsers');
  cy.wait('@getUsers');
});