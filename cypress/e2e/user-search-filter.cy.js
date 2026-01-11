describe('Search and Filter Functionality', () => {
  beforeEach(() => {
    // Setup intercept
    cy.intercept('GET', '**/api/users*').as('getUsers');
    cy.visit('/');
    // Wait for initial load only
    cy.wait('@getUsers');
  });

  describe('Search Functionality', () => {
    it('should filter users by first name', () => {
      cy.get('[data-cy="user-card"]').first().find('[data-cy="user-name"]').invoke('text').then((text) => {
        const firstName = text.split(' ')[0].trim();
        
        cy.get('[data-cy="search-input"]').type(firstName);
        
        // Wait for list to update: Expect at least 1 card AND the name to match
        cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);
        cy.get('[data-cy="user-card"]').first().find('[data-cy="user-name"]').should('contain', firstName);
      });
    });

    it('should filter users by email', () => {
      cy.get('[data-cy="user-card"]').first().find('[data-cy="user-email"]').invoke('text').then((email) => {
        const targetEmail = email.trim();
        cy.get('[data-cy="search-input"]').type(targetEmail);
        
        cy.get('[data-cy="user-card"]').should('have.length', 1);
        cy.get('[data-cy="user-card"]').first().find('[data-cy="user-email"]').should('contain', targetEmail);
      });
    });

    it('should show empty state when no results found', () => {
      cy.get('[data-cy="search-input"]').type('nonexistentuserXYZ123');
      
      // Wait for empty state to appear
      cy.get('[data-cy="empty-state"]').should('be.visible').and('contain', 'No Users Found');
    });

    it('should clear search and show all users', () => {
      cy.get('[data-cy="user-card"]').its('length').then((initialCount) => {
        // 1. Filter
        cy.get('[data-cy="search-input"]').type('test');
        
        // Wait for UI to react (either list shrinks or empty state appears)
        cy.wait(500); 

        // 2. Clear
        cy.get('[data-cy="search-input"]').clear();
        
        // 3. Verify logic: Wait for the list length to return to initialCount
        cy.get('[data-cy="user-card"]').should('have.length', initialCount);
      });
    });

    it('should be case-insensitive', () => {
      cy.get('[data-cy="user-card"]').first().find('[data-cy="user-name"]').invoke('text').then((name) => {
        const lowerName = name.toLowerCase().split(' ')[0];
        cy.get('[data-cy="search-input"]').type(lowerName);
        cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);
      });
    });
  });

  describe('Role Filter', () => {
    it('should filter users by Admin role', () => {
      cy.get('[data-cy="filter-role"]').select('Admin');
      
      // Wait for the UI to update: Verify NO "Manager" or "User" exists
      cy.get('[data-cy="user-card"] [data-cy="user-role"]').should('not.contain', 'Manager');
      cy.get('[data-cy="user-card"] [data-cy="user-role"]').should('not.contain', 'User');

      // Now it's safe to loop
      cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
        expect($el.text()).to.contain('Admin');
      });
    });

    it('should filter users by Manager role', () => {
      cy.get('[data-cy="filter-role"]').select('Manager');

      // Wait for Admins to disappear
      cy.get('[data-cy="user-card"] [data-cy="user-role"]').should('not.contain', 'Admin');

      cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
        expect($el.text()).to.contain('Manager');
      });
    });

    it('should filter users by User role', () => {
      cy.get('[data-cy="filter-role"]').select('User');

      // Wait for Admins to disappear
      cy.get('[data-cy="user-card"] [data-cy="user-role"]').should('not.contain', 'Admin');

      cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
        expect($el.text()).to.contain('User');
      });
    });

    it('should show all users when All Roles selected', () => {
      cy.get('[data-cy="user-card"]').its('length').then((initialCount) => {
        cy.get('[data-cy="filter-role"]').select('Admin');
        // Wait for list to shrink
        cy.get('[data-cy="user-card"]').should('have.length.lt', initialCount);

        cy.get('[data-cy="filter-role"]').select('All');
        
        // Wait for list to grow back
        cy.get('[data-cy="user-card"]').should('have.length', initialCount);
      });
    });
  });

  describe('Status Filter', () => {
    it('should filter users by Active status', () => {
      cy.get('[data-cy="filter-status"]').select('Active');
      
      // Wait for Inactive to disappear
      cy.get('[data-cy="user-card"] [data-cy="user-status"]').should('not.contain', 'Inactive');

      cy.get('[data-cy="user-card"] [data-cy="user-status"]').each(($el) => {
        expect($el.text()).to.contain('Active');
      });
    });

    it('should filter users by Inactive status', () => {
      cy.get('[data-cy="filter-status"]').select('Inactive');

      // Wait for Active to disappear
      cy.get('[data-cy="user-card"] [data-cy="user-status"]').should('not.contain', 'Active');
      cy.get('[data-cy="user-card"] [data-cy="user-status"]').should('contain', 'Inactive');

      cy.get('[data-cy="user-card"] [data-cy="user-status"]').each(($el) => {
        expect($el.text()).to.contain('Inactive');
      });
    });

    it('should show all users when All Status selected', () => {
      cy.get('[data-cy="user-card"]').its('length').then((initialCount) => {
        cy.get('[data-cy="filter-status"]').select('Inactive');
        // Wait for filter to apply
        cy.get('[data-cy="user-card"]').should('have.length.lt', initialCount);

        cy.get('[data-cy="filter-status"]').select('All');
        // Wait for reset
        cy.get('[data-cy="user-card"]').should('have.length', initialCount);
      });
    });
  });

  describe('Combined Filters', () => {
    it('should combine search and role filter', () => {
      // 1. Select Role
      cy.get('[data-cy="filter-role"]').select('Admin');
      // Wait for UI update
      cy.get('[data-cy="user-card"] [data-cy="user-role"]').should('not.contain', 'Manager');

      // 2. Type Search
      cy.get('[data-cy="search-input"]').type('a'); 
      
      cy.wait(1000); // Wait for UI to settle

      // 3. Verify
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="user-card"]').length > 0) {
            cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
                expect($el.text()).to.contain('Admin');
            });
            cy.get('[data-cy="user-card"] [data-cy="user-name"]').each(($el) => {
                expect($el.text().toLowerCase()).to.contain('a');
            });
        } else {
            cy.get('[data-cy="empty-state"]').should('be.visible');
        }
      });
    });

    it('should combine role and status filters', () => {
      cy.get('[data-cy="filter-role"]').select('User');
      cy.get('[data-cy="user-card"] [data-cy="user-role"]').should('not.contain', 'Admin');

      cy.get('[data-cy="filter-status"]').select('Active');
      
      // CRITICAL FIX: Wait for UI to settle before capturing body
      cy.wait(1000);
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="user-card"]').length > 0) {
           cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
             expect($el.text()).to.contain('User');
           });
           cy.get('[data-cy="user-card"] [data-cy="user-status"]').each(($el) => {
             expect($el.text()).to.contain('Active');
           });
        } else {
           cy.get('[data-cy="empty-state"]').should('be.visible');
        }
      });
    });

    it('should combine all three filters', () => {
      cy.get('[data-cy="search-input"]').type('doe');
      cy.get('[data-cy="filter-role"]').select('Admin');
      cy.get('[data-cy="filter-status"]').select('Active');
      
      // CRITICAL FIX: Wait for UI to settle before capturing body
      cy.wait(1000); 
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="user-card"]').length > 0) {
          cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
            expect($el.text()).to.contain('Admin');
          });
          cy.get('[data-cy="user-card"] [data-cy="user-status"]').each(($el) => {
            expect($el.text()).to.contain('Active');
          });
          cy.get('[data-cy="user-card"] [data-cy="user-name"]').each(($el) => {
            expect($el.text().toLowerCase()).to.contain('doe');
          });
        } else {
          cy.get('[data-cy="empty-state"]').should('be.visible');
        }
      });
    });

    it('should update user count when filters are applied', () => {
      cy.get('[data-cy="user-count"]').invoke('text').then((originalCount) => {
        cy.get('[data-cy="filter-role"]').select('Admin');
        
        // Wait for the text to actually change
        cy.get('[data-cy="user-count"]').invoke('text').should('not.equal', originalCount);
      });
    });
  });
});