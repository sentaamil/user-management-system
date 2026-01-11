describe('Search and Filter Functionality', () => {
  beforeEach(() => {
    // 1. Setup the intercept for ANY call to the users API
    // We use a wildcard (*) so it catches search and filter requests too
    cy.intercept('GET', '**/api/users*').as('getUsers');
    
    cy.visit('/');
    // Wait for the initial load
    cy.wait('@getUsers');
  });

  describe('Search Functionality', () => {
    it('should filter users by first name', () => {
      cy.get('[data-cy="user-card"]').first().find('[data-cy="user-name"]').invoke('text').as('targetName');

      cy.get('@targetName').then((name) => {
        const firstName = name.split(' ')[0];
        cy.get('[data-cy="search-input"]').type(firstName);
        
        // WAIT for the search to update the list
        cy.wait('@getUsers');

        cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);
        cy.get('[data-cy="user-card"]').first().find('[data-cy="user-name"]').should('contain', firstName);
      });
    });

    it('should filter users by email', () => {
      cy.get('[data-cy="user-card"]').first().find('[data-cy="user-email"]').invoke('text').then((email) => {
        cy.get('[data-cy="search-input"]').type(email);
        
        cy.wait('@getUsers');

        cy.get('[data-cy="user-card"]').should('have.length', 1);
      });
    });

    it('should show empty state when no results found', () => {
      cy.get('[data-cy="search-input"]').type('nonexistentuser12345');
      cy.wait('@getUsers');
      
      cy.get('[data-cy="empty-state"]').should('be.visible');
      cy.get('[data-cy="empty-state"]').should('contain', 'No Users Found');
    });

    it('should clear search and show all users', () => {
      cy.get('[data-cy="user-card"]').its('length').then((initialCount) => {
        cy.get('[data-cy="search-input"]').type('test');
        cy.wait('@getUsers');
        
        cy.get('[data-cy="search-input"]').clear();
        cy.wait('@getUsers'); // Wait for list to reload
        
        cy.get('[data-cy="user-card"]').should('have.length', initialCount);
      });
    });

    it('should be case-insensitive', () => {
      cy.get('[data-cy="user-card"]').first().find('[data-cy="user-name"]').invoke('text').then((name) => {
        const lowerName = name.toLowerCase();
        cy.get('[data-cy="search-input"]').type(lowerName);
        
        cy.wait('@getUsers');

        // FIXED: Removed [data-cy="user-list"] as it was causing the error
        cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);
      });
    });
  });

  describe('Role Filter', () => {
    it('should filter users by Admin role', () => {
      cy.get('[data-cy="filter-role"]').select('Admin');
      cy.wait('@getUsers'); // Wait for re-render
      
      cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);
      
      cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
        cy.wrap($el).should('contain', 'Admin');
      });
    });

    it('should filter users by Manager role', () => {
      cy.get('[data-cy="filter-role"]').select('Manager');
      cy.wait('@getUsers');
      
      cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);

      cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
        cy.wrap($el).should('contain', 'Manager');
      });
    });

    it('should filter users by User role', () => {
      cy.get('[data-cy="filter-role"]').select('User');
      cy.wait('@getUsers');
      
      cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);

      cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
        cy.wrap($el).should('contain', 'User');
      });
    });

    it('should show all users when All Roles selected', () => {
      cy.get('[data-cy="user-card"]').its('length').then((initialCount) => {
        cy.get('[data-cy="filter-role"]').select('Admin');
        cy.wait('@getUsers');

        cy.get('[data-cy="filter-role"]').select('All'); 
        cy.wait('@getUsers');

        cy.get('[data-cy="user-card"]').should('have.length', initialCount);
      });
    });
  });

  describe('Status Filter', () => {
    it('should filter users by Active status', () => {
      cy.get('[data-cy="filter-status"]').select('Active');
      cy.wait('@getUsers');
      
      cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);

      cy.get('[data-cy="user-card"] [data-cy="user-status"]').each(($el) => {
        cy.wrap($el).should('contain', 'Active');
      });
    });

    it('should filter users by Inactive status', () => {
      cy.get('[data-cy="filter-status"]').select('Inactive');
      cy.wait('@getUsers');
      
      cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);

      cy.get('[data-cy="user-card"] [data-cy="user-status"]').each(($el) => {
        cy.wrap($el).should('contain', 'Inactive');
      });
    });

    it('should show all users when All Status selected', () => {
      cy.get('[data-cy="user-card"]').its('length').then((initialCount) => {
        cy.get('[data-cy="filter-status"]').select('Inactive');
        cy.wait('@getUsers');

        cy.get('[data-cy="filter-status"]').select('All');
        cy.wait('@getUsers');

        cy.get('[data-cy="user-card"]').should('have.length', initialCount);
      });
    });
  });

  describe('Combined Filters', () => {
    it('should combine search and role filter', () => {
      cy.get('[data-cy="filter-role"]').select('Admin');
      cy.wait('@getUsers');

      cy.get('[data-cy="search-input"]').type('a'); 
      cy.wait('@getUsers');

      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="user-card"]').length > 0) {
            cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
                cy.wrap($el).should('contain', 'Admin');
            });
        }
      });
    });

    it('should combine role and status filters', () => {
      cy.get('[data-cy="filter-role"]').select('User');
      cy.wait('@getUsers');

      cy.get('[data-cy="filter-status"]').select('Active');
      cy.wait('@getUsers');
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="user-card"]').length > 0) {
           cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
             cy.wrap($el).should('contain', 'User');
           });
           cy.get('[data-cy="user-card"] [data-cy="user-status"]').each(($el) => {
             cy.wrap($el).should('contain', 'Active');
           });
        } else {
           cy.get('[data-cy="empty-state"]').should('be.visible');
        }
      });
    });

    it('should combine all three filters', () => {
      cy.get('[data-cy="search-input"]').type('doe');
      cy.wait('@getUsers');

      cy.get('[data-cy="filter-role"]').select('Admin');
      cy.wait('@getUsers');

      cy.get('[data-cy="filter-status"]').select('Active');
      cy.wait('@getUsers');
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="user-card"]').length > 0) {
          cy.get('[data-cy="user-card"] [data-cy="user-role"]').each(($el) => {
            cy.wrap($el).should('contain', 'Admin');
          });
          cy.get('[data-cy="user-card"] [data-cy="user-status"]').each(($el) => {
            cy.wrap($el).should('contain', 'Active');
          });
        } else {
          cy.get('[data-cy="empty-state"]').should('be.visible');
        }
      });
    });

    it('should update user count when filters are applied', () => {
      cy.get('[data-cy="user-count"]').invoke('text').then((originalCount) => {
        cy.get('[data-cy="filter-role"]').select('Admin');
        cy.wait('@getUsers');
        
        cy.get('[data-cy="user-count"]').invoke('text').should('not.equal', originalCount);
      });
    });
  });
});