/**
 * Tests for FlashcardScreen component
 */
// eslint-disable-next-line repo/test-location
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { FlashcardScreen } from '../screens/study/FlashcardScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const mockRoute = {
  params: {
    language: 'python',
    sectionId: 'section-1',
    sectionTitle: 'Variables & Data Types',
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe('FlashcardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section title in header', () => {
    render(<FlashcardScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText('Variables & Data Types')).toBeTruthy();
  });

  it('shows card counter', () => {
    render(<FlashcardScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText(/1\//)).toBeTruthy();
  });

  it('shows PROMPT badge on front of card', () => {
    render(<FlashcardScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText('PROMPT')).toBeTruthy();
  });

  it('shows Reveal Answer button before flip', () => {
    render(<FlashcardScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText('Reveal Answer')).toBeTruthy();
  });

  it('navigates back when close button pressed', () => {
    render(<FlashcardScreen navigation={mockNavigation} route={mockRoute} />);
    const closeBtn = screen.getByText('✕');
    fireEvent.press(closeBtn);
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('shows hint button when hint is available', () => {
    render(<FlashcardScreen navigation={mockNavigation} route={mockRoute} />);
    // First card has a hint
    expect(screen.getByText(/Hint/i)).toBeTruthy();
  });
});
