import { render, screen, fireEvent } from '@testing-library/react';
import { MuteWordEntry } from '../components/MuteWordEntry';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('MuteWordEntry Component', () => {
  const mockEntry = {
    muted_word: 'annoyingword',
    created_date: 1700000000,
    expiration_date: 1737827040,
  };

  const mockSetRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({}),
      })
    ) as any;
  });

  it('renders mute word entry details', () => {
    render(<MuteWordEntry entry={mockEntry} setRefresh={mockSetRefresh} />);

    expect(screen.getByText('annoyingword')).toBeInTheDocument();
    expect(screen.getByText(/Expires:/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Unmute/i })).toBeInTheDocument();
  });

  it('calls callUnMute when unmute button is clicked', async () => {
    render(<MuteWordEntry entry={mockEntry} setRefresh={mockSetRefresh} />);

    const unmuteButton = screen.getByRole('button', { name: /Unmute/i });
    fireEvent.click(unmuteButton);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/deleteTimedMuteWord'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          muted_word: mockEntry.muted_word,
        }),
      })
    );
  });
});
