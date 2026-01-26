import { render, screen, fireEvent } from '@testing-library/react';
import { MuteEntry } from '../components/MuteEntry';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('MuteEntry Component', () => {
  const mockEntry = {
    actor: 'did:plc:123',
    muted_actor: 'did:plc:456',
    created_date: 1700000000,
    expiration_date: 1737827040, // Some future date
    profile: {
      did: 'did:plc:456',
      handle: 'testuser.bsky.social',
      displayName: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
    } as any,
  };

  const mockSetRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({}),
      })
    ) as any;
  });

  it('renders mute entry details', () => {
    render(<MuteEntry entry={mockEntry} setRefresh={mockSetRefresh} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser.bsky.social')).toBeInTheDocument();
    expect(screen.getByText(/Expires:/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Unmute/i })).toBeInTheDocument();
  });

  it('calls callUnMute when unmute button is clicked', async () => {
    render(<MuteEntry entry={mockEntry} setRefresh={mockSetRefresh} />);

    const unmuteButton = screen.getByRole('button', { name: /Unmute/i });
    fireEvent.click(unmuteButton);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/deleteTimedMute'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          muted_actor_did: mockEntry.muted_actor,
          expiration_date: mockEntry.expiration_date,
        }),
      })
    );
  });
});
