import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Main from './main';
import { LoginProvider } from '../context/LoginContext';

// Mock the components used in Main
jest.mock('../dashboard/dashboard', () => {
  return {
    __esModule: true,
    default: ({ loggedInUser }: { loggedInUser: string }) => (
      <div data-testid="mock-dashboard">Dashboard for {loggedInUser}</div>
    ),
  };
});

jest.mock('../home/home', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-home">Home Component</div>,
  };
});

describe('Main Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders Home component when user is not logged in', () => {
    render(
      <LoginProvider>
        <Main />
      </LoginProvider>
    );
    
    expect(screen.getByTestId('mock-home')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-dashboard')).not.toBeInTheDocument();
  });

  test('renders Dashboard component when user is logged in', () => {
    // Set up localStorage to simulate logged in user
    localStorage.setItem('isLoggedInUser', 'TestUser');
    
    render(
      <LoginProvider>
        <Main />
      </LoginProvider>
    );
    
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dashboard for TestUser')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-home')).not.toBeInTheDocument();
  });
});
