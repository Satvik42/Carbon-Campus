import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Onboarding } from '../features/onboarding/onboarding';

// Mock Zustand App Store to isolate database and network state
vi.mock('../stores/useAppStore', () => {
  const mockSaveProfile = vi.fn().mockResolvedValue(undefined);
  return {
    useAppStore: (selector: any) => {
      const state = {
        profile: null,
        isOnboarded: false,
        journeyItems: [],
        chatMessages: [],
        loadingAssistant: false,
        reducedMotion: false,
        saveProfile: mockSaveProfile,
      };
      return selector(state);
    },
  };
});

describe('Onboarding Component', () => {
  it('renders Step 1 with dietary preferences correctly', () => {
    const onCompleteMock = vi.fn();
    render(<Onboarding onComplete={onCompleteMock} />);

    // Check title of step 1
    expect(screen.getByText('What are your dietary preferences?')).toBeDefined();
    
    // Check diet options
    expect(screen.getByText('Meat Lover')).toBeDefined();
    expect(screen.getByText('Vegetarian')).toBeDefined();
    expect(screen.getByText('Vegan')).toBeDefined();
  });

  it('navigates to step 2 on clicking next', async () => {
    const onCompleteMock = vi.fn();
    render(<Onboarding onComplete={onCompleteMock} />);

    // Click on Vegetarian diet option
    const vegBtn = screen.getByText('Vegetarian').closest('button');
    if (vegBtn) fireEvent.click(vegBtn);

    // Click Next
    const nextBtn = screen.getByRole('button', { name: 'Next Step' });
    fireEvent.click(nextBtn);

    // Should now show Step 2
    expect(await screen.findByText('How do you commute?')).toBeDefined();
    expect(await screen.findByText('Drive Alone')).toBeDefined();
  });
});
