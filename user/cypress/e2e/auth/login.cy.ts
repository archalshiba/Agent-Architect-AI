describe('Login Page', () => {
  it('should display email, password fields and a login button', () => {
    cy.visit('/auth/login');

    // Check for email field
    cy.get('input[type="email"]').should('be.visible').and('have.attr', 'placeholder', 'Email address');

    // Check for password field
    cy.get('input[type="password"]').should('be.visible').and('have.attr', 'placeholder', 'Password');

    // Check for login button
    cy.contains('button', /Sign in/i).should('be.visible').and('not.be.disabled');
  });
});