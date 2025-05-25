import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Floater from '../src/Floater';

test('renders the Floater menu', () => {
  render(<Floater />);
  const floaterTitle = screen.getByRole('heading', { name: /Who's that\?/i });
  expect(floaterTitle).toBeInTheDocument();
});

test('renders an x button to close the menu', () => {
  render(<Floater />);
  const closeButton = screen.queryByRole('button', { name: /x|close/i });
  expect(closeButton).toBeInTheDocument();
});

test('renders character names from characterMap', () => {
  const characterMap = { 1: 'Waldo', 2: 'Odlaw', 3: 'Wizard Whitebeard' };
  render(<Floater characterMap={characterMap} />);
  expect(screen.getByText('Waldo')).toBeInTheDocument();
  expect(screen.getByText('Odlaw')).toBeInTheDocument();
  expect(screen.getByText('Wizard Whitebeard')).toBeInTheDocument();
});