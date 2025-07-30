import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DoughnutChart from './doughnut-chart';
import { Portfolio, Asset } from '../../services/api.service';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock Chart.js to avoid canvas rendering issues in tests
jest.mock('react-chartjs-2', () => ({
  Doughnut: () => <div data-testid="mock-doughnut-chart" />
}));

describe('DoughnutChart Component', () => {
  const mockAssets: Asset[] = [
    { id: '123e4567-e89b-12d3-a456-426614174010', name: 'AAPL', type: 'stock' },
    { id: '123e4567-e89b-12d3-a456-426614174013', name: 'BTC', type: 'crypto' },
    { id: '123e4567-e89b-12d3-a456-426614174015', name: 'GBP', type: 'fiat' }
  ];

  const mockPortfolio: Portfolio = {
    id: '323e4567-e89b-12d3-a456-426614174000',
    asOf: '2023-07-29T00:00:00Z',
    positions: [
      { id: 'pos-1', asset: '123e4567-e89b-12d3-a456-426614174010', quantity: 10, price: 180.95, asOf: '2023-07-29T00:00:00Z' },
      { id: 'pos-2', asset: '123e4567-e89b-12d3-a456-426614174013', quantity: 0.5, price: 58750.25, asOf: '2023-07-29T00:00:00Z' },
      { id: 'pos-3', asset: '123e4567-e89b-12d3-a456-426614174015', quantity: 100, price: 1.22, asOf: '2023-07-29T00:00:00Z' }
    ]
  };

  const mockOnAssetSelect = jest.fn();

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders doughnut chart when data is available', () => {
    renderWithTheme(
      <DoughnutChart 
        portfolio={mockPortfolio} 
        assets={mockAssets} 
        selectedAssetType="" 
        onAssetSelect={mockOnAssetSelect} 
      />
    );
    
    expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
  });

  test('renders "No allocation data available" when portfolio is null', () => {
    renderWithTheme(
      <DoughnutChart 
        portfolio={null as any} 
        assets={mockAssets} 
        selectedAssetType="" 
        onAssetSelect={mockOnAssetSelect} 
      />
    );
    
    expect(screen.getByText('No allocation data available')).toBeInTheDocument();
  });

  test('renders "No allocation data available" when assets array is empty', () => {
    renderWithTheme(
      <DoughnutChart 
        portfolio={mockPortfolio} 
        assets={[]} 
        selectedAssetType="" 
        onAssetSelect={mockOnAssetSelect} 
      />
    );
    
    expect(screen.getByText('No allocation data available')).toBeInTheDocument();
  });

  test('renders chart with all asset types when selectedAssetType is empty', () => {
    renderWithTheme(
      <DoughnutChart 
        portfolio={mockPortfolio} 
        assets={mockAssets} 
        selectedAssetType="" 
        onAssetSelect={mockOnAssetSelect} 
      />
    );
    
    expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
  });

  test('renders chart with specific asset type when selectedAssetType is set', () => {
    renderWithTheme(
      <DoughnutChart 
        portfolio={mockPortfolio} 
        assets={mockAssets} 
        selectedAssetType="stock" 
        onAssetSelect={mockOnAssetSelect} 
      />
    );
    
    expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
  });

  test('renders chart with all assets when selectedAssetType is "all"', () => {
    renderWithTheme(
      <DoughnutChart 
        portfolio={mockPortfolio} 
        assets={mockAssets} 
        selectedAssetType="all" 
        onAssetSelect={mockOnAssetSelect} 
      />
    );
    
    expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
  });
});
