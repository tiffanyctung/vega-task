import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginProvider, useLogin } from './LoginContext';

// Create a test component that uses the login context
const TestComponent = () => {
  const { 
    showLoginForm, 
    setShowLoginForm, 
    isLoggedIn, 
    setIsLoggedIn, 
    loggedInUser, 
    setLoggedInUser 
  } = useLogin();
  
  return (
    <div>
      <div data-testid="login-form-status">{showLoginForm ? 'shown' : 'hidden'}</div>
      <div data-testid="login-status">{isLoggedIn ? 'logged-in' : 'logged-out'}</div>
      <div data-testid="username">{loggedInUser || 'no-user'}</div>
      <button onClick={() => setShowLoginForm(!showLoginForm)}>Toggle Form</button>
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>Toggle Login</button>
      <button onClick={() => setLoggedInUser('TestUser')}>Set User</button>
    </div>
  );
};

describe('LoginContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('provides default login state', () => {
    render(
      <LoginProvider>
        <TestComponent />
      </LoginProvider>
    );
    
    expect(screen.getByTestId('login-form-status')).toHaveTextContent('hidden');
    expect(screen.getByTestId('login-status')).toHaveTextContent('logged-out');
    expect(screen.getByTestId('username')).toHaveTextContent('no-user');
  });

  test('toggles login form visibility', () => {
    render(
      <LoginProvider>
        <TestComponent />
      </LoginProvider>
    );
    
    // Initially hidden
    expect(screen.getByTestId('login-form-status')).toHaveTextContent('hidden');
    
    // Toggle to shown
    fireEvent.click(screen.getByText('Toggle Form'));
    expect(screen.getByTestId('login-form-status')).toHaveTextContent('shown');
    
    // Toggle back to hidden
    fireEvent.click(screen.getByText('Toggle Form'));
    expect(screen.getByTestId('login-form-status')).toHaveTextContent('hidden');
  });

  test('toggles login state', () => {
    render(
      <LoginProvider>
        <TestComponent />
      </LoginProvider>
    );
    
    // Initially logged out
    expect(screen.getByTestId('login-status')).toHaveTextContent('logged-out');
    
    // Toggle to logged in
    fireEvent.click(screen.getByText('Toggle Login'));
    expect(screen.getByTestId('login-status')).toHaveTextContent('logged-in');
    
    // Toggle back to logged out
    fireEvent.click(screen.getByText('Toggle Login'));
    expect(screen.getByTestId('login-status')).toHaveTextContent('logged-out');
  });

  test('sets username', () => {
    render(
      <LoginProvider>
        <TestComponent />
      </LoginProvider>
    );
    
    // Initially no user
    expect(screen.getByTestId('username')).toHaveTextContent('no-user');
    
    // Set username
    fireEvent.click(screen.getByText('Set User'));
    expect(screen.getByTestId('username')).toHaveTextContent('TestUser');
  });

  test('initializes with stored login state from localStorage', () => {
    // Setup localStorage with logged in user
    localStorage.setItem('isLoggedInUser', 'StoredUser');
    
    render(
      <LoginProvider>
        <TestComponent />
      </LoginProvider>
    );
    
    // Should initialize with logged in state based on localStorage
    expect(screen.getByTestId('login-status')).toHaveTextContent('logged-in');
    expect(screen.getByTestId('username')).toHaveTextContent('StoredUser');
  });

  test('throws error when useLogin is used outside of LoginProvider', () => {
    // Suppress console.error for this test to avoid noisy output
    const originalError = console.error;
    console.error = jest.fn();
    
    // Expect an error when rendering TestComponent without LoginProvider
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useLogin must be used within a LoginProvider');
    
    // Restore console.error
    console.error = originalError;
  });
});
