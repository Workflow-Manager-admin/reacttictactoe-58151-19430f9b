import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe header', () => {
  render(<App />);
  const header = screen.getByText(/Tic Tac Toe/i);
  expect(header).toBeInTheDocument();
});
