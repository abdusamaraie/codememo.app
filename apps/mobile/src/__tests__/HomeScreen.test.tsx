/**
 * Tests for HomeScreen component
 */
// eslint-disable-next-line repo/test-location
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HomeScreen } from '../screens/home/HomeScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the greeting', () => {
    render(<HomeScreen navigation={mockNavigation} />);
    expect(screen.getByText(/Good morning/i)).toBeTruthy();
  });

  it('shows due card count', () => {
    render(<HomeScreen navigation={mockNavigation} />);
    expect(screen.getByText(/cards due today/i)).toBeTruthy();
  });

  it('renders streak information', () => {
    render(<HomeScreen navigation={mockNavigation} />);
    expect(screen.getByText(/streak/i)).toBeTruthy();
  });

  it('renders language cards', () => {
    render(<HomeScreen navigation={mockNavigation} />);
    expect(screen.getByText('Python')).toBeTruthy();
    expect(screen.getByText('JavaScript')).toBeTruthy();
  });

  it('renders daily goals section', () => {
    render(<HomeScreen navigation={mockNavigation} />);
    expect(screen.getByText(/Today's Goals/i)).toBeTruthy();
  });
});
