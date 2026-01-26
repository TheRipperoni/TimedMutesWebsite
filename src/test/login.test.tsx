import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../login';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

// Mock getAgentLogin
vi.mock('./agent.ts', () => ({
  getAgentLogin: vi.fn(),
}));

describe('Login Component', () => {
  const mockProps = {
    setLoggedIn: vi.fn(),
    setEmail: vi.fn(),
    setAgent: vi.fn(),
    setHandlename: vi.fn(),
    setPfpUrl: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <Login {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Handle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/App Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  it('shows error message when handle is empty', () => {
    render(
      <BrowserRouter>
        <Login {...mockProps} />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole('button', { name: /Log In/i });
    fireEvent.click(loginButton);

    expect(screen.getByText(/Please enter your handle/i)).toBeInTheDocument();
  });

  it('shows error message when password is empty', () => {
    render(
      <BrowserRouter>
        <Login {...mockProps} />
      </BrowserRouter>
    );

    const handleInput = screen.getByLabelText(/Handle/i);
    fireEvent.change(handleInput, { target: { value: 'test.bsky.social' } });

    const loginButton = screen.getByRole('button', { name: /Log In/i });
    fireEvent.click(loginButton);

    expect(screen.getByText(/Please enter your app password/i)).toBeInTheDocument();
  });
});
