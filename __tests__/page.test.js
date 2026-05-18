import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugReportPage from '../app/page';

// Mock fetch globally
global.fetch = jest.fn();

describe('BugReportPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'https://mock-api.example.com';
  });

  afterAll(() => {
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  it('renders the form correctly', () => {
    render(<BugReportPage />);
    
    expect(screen.getByRole('heading', { name: /file a bug report/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reproduction steps/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit bug report/i })).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: 1 } })
    });

    render(<BugReportPage />);

    await user.type(screen.getByLabelText(/title \*/i), 'Test Bug');
    await user.type(screen.getByLabelText(/description \*/i), 'This is a test description');
    
    await user.click(screen.getByRole('button', { name: /submit bug report/i }));

    await waitFor(() => {
      expect(screen.getByText(/your bug report has been successfully submitted/i)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('https://mock-api.example.com/v1/issues', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Bug',
        description: 'This is a test description'
      })
    }));

    // Check if form is cleared
    expect(screen.getByLabelText(/title \*/i)).toHaveValue('');
    expect(screen.getByLabelText(/description \*/i)).toHaveValue('');
  });

  it('handles validation errors from the API', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Validation failed: Title is too short' })
    });

    render(<BugReportPage />);

    await user.type(screen.getByLabelText(/title \*/i), 'A');
    await user.type(screen.getByLabelText(/description \*/i), 'Valid description');
    
    await user.click(screen.getByRole('button', { name: /submit bug report/i }));

    await waitFor(() => {
      // The error message should appear below the title field since we have logic to map "title" to the field
      expect(screen.getByText(/title is too short/i)).toBeInTheDocument();
    });
    
    // Form should not be cleared
    expect(screen.getByLabelText(/title \*/i)).toHaveValue('A');
  });

  it('handles global server errors', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Database connection failed' })
    });

    render(<BugReportPage />);

    await user.type(screen.getByLabelText(/title \*/i), 'Server Error Test');
    await user.type(screen.getByLabelText(/description \*/i), 'Server Error Description');
    
    await user.click(screen.getByRole('button', { name: /submit bug report/i }));

    await waitFor(() => {
      expect(screen.getByText(/database connection failed/i)).toBeInTheDocument();
    });
  });

  it('handles network errors (fetch throws)', async () => {
    const user = userEvent.setup();
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<BugReportPage />);

    await user.type(screen.getByLabelText(/title \*/i), 'Network Error Test');
    await user.type(screen.getByLabelText(/description \*/i), 'Network Error Description');
    
    await user.click(screen.getByRole('button', { name: /submit bug report/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to connect to the server/i)).toBeInTheDocument();
    });
  });
});
