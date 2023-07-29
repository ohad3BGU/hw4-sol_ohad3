describe('Login Page - End-to-End Tests', () => {
  
    it('should display error message for empty form submission', () => {
      // Submit the login form with empty fields
      cy.visit('http://localhost:3000/login');
      cy.get('button[type="submit"]').click();
  
      // Verify the error message for empty fields
      cy.contains('All fields must not be empty').should('be.visible');
    });

    it('should display error message for empty password submission', () => {
      // Submit the login form with empty fields
      cy.visit('http://localhost:3000/login');
      cy.get('input[type="text"]').type('randomUsername');
      cy.get('button[type="submit"]').click();
  
      // Verify the error message for empty fields
      cy.contains('All fields must not be empty').should('be.visible');
    });

    it('should display error message for empty username form submission', () => {
      // Submit the login form with empty fields
      cy.visit('http://localhost:3000/login');
      cy.get('input[type="password"]').type('randomPassword');
      cy.get('button[type="submit"]').click();
  
      // Verify the error message for empty fields
      cy.contains('All fields must not be empty').should('be.visible');
    });
  
    it('should display error message for invalid credentials', () => {
      // Fill out the login form with incorrect credentials and submit it
      cy.visit('http://localhost:3000/login');
      cy.get('input[type="text"]').type('invalidUsername');
      cy.get('input[type="password"]').type('invalidPassword');
      cy.get('button[type="submit"]').click();
  
      // Verify the error message for invalid credentials
      cy.contains('Invalid credentials').should('be.visible');
      // Should not redirect
      cy.url().should('eq', 'http://localhost:3000/login');
    });
  
    it('should direct to signup page when clicking on "Sign up" button', () => {
      // Click on the "Sign up" link
      cy.visit('http://localhost:3000/login');
      cy.get('.signup-link a').click();
  
      // Verify the redirection to the signup page from the login page
      cy.url().should('eq', 'http://localhost:3000/signup');
    });
  });
  