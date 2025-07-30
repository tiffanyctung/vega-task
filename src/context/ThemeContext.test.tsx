import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from './ThemeContext';

// Create a test component that uses the theme context
const TestComponent = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-status">{darkMode ? 'dark' : 'light'}</div>
      <button onClick={toggleDarkMode}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  test('provides default theme (light mode)', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  test('toggles theme when toggle function is called', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initially in light mode
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    
    // Toggle to dark mode
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    
    // Toggle back to light mode
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  test('persists theme preference in localStorage', () => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        clear: () => {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Toggle to dark mode
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    // Check if localStorage was updated
    expect(localStorageMock.getItem('darkMode')).toBe('true');
    
    // Toggle back to light mode
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    // Check if localStorage was updated
    expect(localStorageMock.getItem('darkMode')).toBe('false');
  });

  test('initializes with stored theme preference', () => {
    // Mock localStorage with dark mode preference
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue('true'),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Should initialize with dark mode based on localStorage
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });
});
