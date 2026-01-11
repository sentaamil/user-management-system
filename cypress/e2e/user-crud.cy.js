describe('User CRUD Operations', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForUserList();
  });

  describe('Create User', () => {
    it('should open add user modal when clicking add button', () => {
      cy.get('[data-cy="add-user-btn"]').click();
      cy.get('[data-cy="user-modal"]').should('be.visible');
      cy.get('[data-cy="user-form"]').should('be.visible');
    });

    it('should close modal when clicking cancel', () => {
      cy.get('[data-cy="add-user-btn"]').click();
      cy.get('[data-cy="user-modal"]').should('be.visible');
      cy.contains('Cancel').click();
      cy.get('[data-cy="user-modal"]').should('not.exist');
    });

    it('should close modal when clicking X button', () => {
      cy.get('[data-cy="add-user-btn"]').click();
      cy.get('[data-cy="user-modal"]').should('be.visible');
      cy.get('[data-cy="close-modal"]').click();
      cy.get('[data-cy="user-modal"]').should('not.exist');
    });

    it('should create a new user successfully', () => {
      cy.fixture('users').then((users) => {
        cy.get('[data-cy="add-user-btn"]').click();
        cy.fillUserForm(users.validUser);

        cy.intercept('POST', '**/api/users').as('createUser');
        cy.get('[data-cy="submit-user"]').click();

        cy.wait('@createUser').its('response.statusCode').should('eq', 201);
        cy.get('[data-cy="notification"]').should('contain', 'User created successfully');
        cy.get('[data-cy="user-modal"]').should('not.exist');
      });
    });

    it('should show validation errors for empty required fields', () => {
      cy.get('[data-cy="add-user-btn"]').click();
      cy.get('[data-cy="submit-user"]').click();

      cy.get('.error-msg').should('have.length.at.least', 1);
      cy.contains('First name is required').should('be.visible');
    });

    // --- CORRECTED TEST CASE ---
    it('should validate email format', () => {
      cy.get('[data-cy="add-user-btn"]').click();

      // Fill in all required fields with valid data
      cy.get('[data-cy="input-firstName"]').type('Test');
      cy.get('[data-cy="input-lastName"]').type('User');
      cy.get('[data-cy="input-phone"]').type('+1-555-0000');
      cy.get('[data-cy="input-department"]').type('Testing');
      cy.get('[data-cy="input-location"]').type('Test City');

      // Now type invalid email AND blur to trigger validation
      cy.get('[data-cy="input-email"]')
        .type('invalid-email')
        .blur(); // Added .blur() in case validation runs on focus loss

      cy.get('[data-cy="submit-user"]').click();

      // Check for the error MESSAGE first (this confirms validation logic ran)
      cy.get('.error-msg').contains('Email is invalid').should('be.visible');

      // Check input state: Checks for class 'error' OR 'is-invalid' OR native HTML5 invalid state
      cy.get('[data-cy="input-email"]').should(($input) => {
        const hasErrorClass = $input.hasClass('error') || $input.hasClass('is-invalid');
        const isNativeInvalid = $input[0].checkValidity() === false;
        expect(hasErrorClass || isNativeInvalid, 'Input should be marked invalid').to.be.true;
      });
    });
  });

  describe('Read/View Users', () => {
    it('should display all users on page load', () => {
      cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);
    });

    it('should show user details correctly', () => {
      cy.get('[data-cy="user-card"]').first().within(() => {
        cy.get('[data-cy="user-name"]').should('not.be.empty');
        cy.get('[data-cy="user-email"]').should('contain', '@');
        cy.get('[data-cy="user-role"]').should('not.be.empty');
        cy.get('[data-cy="user-department"]').should('not.be.empty');
      });
    });
  });

  describe('Update User', () => {
    it('should open edit modal with user data', () => {
      cy.get('[data-cy="user-card"]').first().within(() => {
        cy.get('[data-cy="edit-user-btn"]').click();
      });

      cy.get('[data-cy="user-modal"]').should('be.visible');
      cy.get('[data-cy="input-firstName"]').should('not.have.value', '');
      cy.get('[data-cy="input-email"]').should('not.have.value', '');
    });

    it('should update user successfully', () => {
      cy.get('[data-cy="user-card"]').first().within(() => {
        cy.get('[data-cy="edit-user-btn"]').click();
      });

      cy.get('[data-cy="input-firstName"]').clear().type('Updated');
      cy.get('[data-cy="input-lastName"]').clear().type('Name');

      cy.intercept('PUT', '**/api/users/*').as('updateUser');
      cy.get('[data-cy="submit-user"]').click();

      cy.wait('@updateUser').its('response.statusCode').should('eq', 200);
      cy.get('[data-cy="notification"]').should('contain', 'User updated successfully');
    });

    it('should update user role', () => {
      cy.get('[data-cy="user-card"]').first().within(() => {
        cy.get('[data-cy="edit-user-btn"]').click();
      });

      cy.get('[data-cy="input-role"]').select('Admin');

      cy.intercept('PUT', '**/api/users/*').as('updateUser');
      cy.get('[data-cy="submit-user"]').click();

      cy.wait('@updateUser');
      cy.get('[data-cy="notification"]').should('be.visible');
    });

    it('should update user status', () => {
      cy.get('[data-cy="user-card"]').first().within(() => {
        cy.get('[data-cy="edit-user-btn"]').click();
      });

      cy.get('[data-cy="input-status"]').select('Inactive');

      cy.intercept('PUT', '**/api/users/*').as('updateUser');
      cy.get('[data-cy="submit-user"]').click();

      cy.wait('@updateUser');
      cy.get('[data-cy="notification"]').should('be.visible');
    });
  });

  describe('Delete User', () => {
    it('should show confirmation dialog when deleting', () => {
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(false);
      });

      cy.get('[data-cy="user-card"]').last().within(() => {
        cy.get('[data-cy="delete-user-btn"]').click();
      });
    });

    it('should delete user when confirmed', () => {
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });

      cy.intercept('DELETE', '**/api/users/*').as('deleteUser');

      cy.get('[data-cy="user-card"]').last().within(() => {
        cy.get('[data-cy="delete-user-btn"]').click();
      });

      cy.wait('@deleteUser').its('response.statusCode').should('eq', 200);
      cy.get('[data-cy="notification"]').should('contain', 'User deleted successfully');
    });

    it('should not delete user when cancelled', () => {
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(false);
      });

      cy.get('[data-cy="user-card"]').its('length').then((initialCount) => {
        cy.get('[data-cy="user-card"]').last().within(() => {
          cy.get('[data-cy="delete-user-btn"]').click();
        });

        cy.get('[data-cy="user-card"]').should('have.length', initialCount);
      });
    });
  });
});