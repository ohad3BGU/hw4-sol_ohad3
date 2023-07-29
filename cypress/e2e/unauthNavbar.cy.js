describe('Navigation to login page using nav-var from index', () => {
    it('should navigate to the login page', () => {
      // Start from the index page
      cy.visit('http://localhost:3000/')
      // Find a link with an href attribute containing "login" and click it
      cy.get('a[href*="login"]').click()
      // The new url should include "/login"
      cy.url().should('include', '/login')
      // The new page should contain an h2 with "Log In"
      cy.get('h2').contains('Log In')
    })
  })

  describe('Navigation to sign-up page using nav-bar from index', () => {
    it('should navigate to the signup page', () => {
      cy.visit('http://localhost:3000/')
      cy.get('a[href*="signup"]').click()
      cy.url().should('include', '/signup')
      cy.get('h2').contains('Sign Up')
    })
  })

  describe('Navigation to feed from feed', () => {
    it('should navigate to the feed (default home page) using nav-bar, from all other unauthenticated pages', () => {
      cy.visit('http://localhost:3000/')
      cy.get('a[href="/"]').click()
      cy.url().should('eq', 'http://localhost:3000/')
      cy.get('h1').contains('Public Feed')
    })
  })

  describe('Navigation to feed from login', () => {
    it('should navigate to the feed (default home page) using nav-bar', () => {
      // Start from the login page
      cy.visit('http://localhost:3000/login')
      cy.get('a[href="/"]').click()
      cy.url().should('eq', 'http://localhost:3000/')
      cy.get('h1').contains('Public Feed')

    })
  })

  describe('Navigation to feed from signup', () => {
    it('should navigate to the feed (default home page) using nav-bar', () => {
      // Start from the signup page
      cy.visit('http://localhost:3000/signup')
      cy.get('a[href="/"]').click()
      cy.url().should('eq', 'http://localhost:3000/')
      cy.get('h1').contains('Public Feed')
    })
  })