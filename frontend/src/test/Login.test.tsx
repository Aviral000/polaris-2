import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/Login';

jest.mock('../components/Header', () => () => <div>Mocked Header</div>);

jest.mock('react-router-dom', () => ({
  Link: () => <div />,
  useNavigate: () => jest.fn(),
}));

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});