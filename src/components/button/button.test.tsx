import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './button';

describe('Button Component', () => {
  test('renders primary button correctly', () => {
    render(<Button type="primary">Primary Button</Button>);
    
    const button = screen.getByText('Primary Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
  });

  test('renders secondary button correctly', () => {
    render(<Button type="secondary">Secondary Button</Button>);
    
    const button = screen.getByText('Secondary Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-secondary');
  });

  test('renders disabled button correctly', () => {
    render(<Button type="disabled">Disabled Button</Button>);
    
    const button = screen.getByText('Disabled Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-disabled');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    
    render(<Button type="primary" onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not throw error when onClick is not provided', () => {
    render(<Button type="primary">No Handler</Button>);
    
    // This should not throw an error
    expect(() => {
      fireEvent.click(screen.getByText('No Handler'));
    }).not.toThrow();
  });
});
