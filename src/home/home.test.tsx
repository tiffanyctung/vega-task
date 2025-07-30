import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './home';
import { LoginProvider } from '../context/LoginContext';

// Mock the components used in Home
jest.mock('../components/button/button', () => {
  return {
    __esModule: true,
    default: ({ children, onClick, type }: { children: string; onClick: any; type: string }) => (
      <button data-testid={`mock-button-${type}`} onClick={onClick}>
        {children}
      </button>
    ),
  };
});

jest.mock('../components/input/input', () => {
  return {
    __esModule: true,
    default: ({ type, placeholder, value, onChange }: { type: string; placeholder: string; value: string; onChange: any }) => (
      <input
        data-testid={`mock-input-${type}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    ),
  };
});

describe('Home Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const renderWithLoginProvider = () => {
    return render(
      <LoginProvider>
        <Home />
      </LoginProvider>
    );
  };

  test('renders welcome message and login button initially', () => {
    renderWithLoginProvider();
    
    expect(screen.getByText('Welcome to')).toBeInTheDocument();
    expect(screen.getByText('VEGA Portfolio')).toBeInTheDocument();
    expect(screen.getByTestId('mock-button-primary')).toHaveTextContent('Log In');
  });

  test('shows login form when login button is clicked', () => {
    renderWithLoginProvider();
    
    // Click the login button
    fireEvent.click(screen.getByTestId('mock-button-primary'));
    
    // Login form should be visible
    expect(screen.getByTestId('mock-input-text')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-password')).toBeInTheDocument();
    expect(screen.getByTestId('mock-button-primary')).toHaveTextContent('Log In');
    expect(screen.getByTestId('mock-button-secondary')).toHaveTextContent('Cancel');
  });

  test('shows error message when submitting empty form', () => {
    renderWithLoginProvider();
    
    // Click the login button to show form
    fireEvent.click(screen.getByTestId('mock-button-primary'));
    
    // Submit the form without entering credentials
    fireEvent.click(screen.getByText('Log In'));
    
    // Error message should be visible
    expect(screen.getByText('Please enter both username and password')).toBeInTheDocument();
  });

  test('shows error message when submitting invalid credentials', () => {
    renderWithLoginProvider();
    
    // Click the login button to show form
    fireEvent.click(screen.getByTestId('mock-button-primary'));
    
    // Enter invalid credentials
    fireEvent.change(screen.getByTestId('mock-input-text'), { target: { value: 'InvalidUser' } });
    fireEvent.change(screen.getByTestId('mock-input-password'), { target: { value: 'InvalidPassword' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Log In'));
    
    // Error message should be visible
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });

  test('logs in successfully with valid credentials', () => {
    // Mock localStorage.setItem
    const localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
    
    renderWithLoginProvider();
    
    // Click the login button to show form
    fireEvent.click(screen.getByTestId('mock-button-primary'));
    
    // Enter valid credentials (from the credentials array in home.tsx)
    fireEvent.change(screen.getByTestId('mock-input-text'), { target: { value: 'Tiffany' } });
    fireEvent.change(screen.getByTestId('mock-input-password'), { target: { value: 'Vega123!' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Log In'));
    
    // localStorage.setItem should be called with the username
    expect(localStorageSpy).toHaveBeenCalledWith('isLoggedInUser', 'Tiffany');
  });

  test('hides login form when cancel button is clicked', () => {
    renderWithLoginProvider();
    
    // Click the login button to show form
    fireEvent.click(screen.getByTestId('mock-button-primary'));
    
    // Login form should be visible
    expect(screen.getByTestId('mock-input-text')).toBeInTheDocument();
    
    // Click the cancel button
    fireEvent.click(screen.getByTestId('mock-button-secondary'));
    
    // Login form should be hidden, and we're back to the initial view
    expect(screen.queryByTestId('mock-input-text')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-button-primary')).toHaveTextContent('Log In');
  });
});
