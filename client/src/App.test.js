import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the festival finance navigation', () => {
  render(<App />);
  expect(screen.getByText('Ganpati Mandal')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
});
