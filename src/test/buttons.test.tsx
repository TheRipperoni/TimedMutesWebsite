import { render, screen } from '@testing-library/react';
import { UnmuteButton } from '../components/buttons';
import { describe, it, expect } from 'vitest';

describe('UnmuteButton', () => {
  it('renders a button', () => {
    render(<UnmuteButton />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });
});
