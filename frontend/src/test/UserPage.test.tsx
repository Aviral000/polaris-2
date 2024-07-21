import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserPage from '../pages/UserPage';

jest.mock('../components/Header', () => () => <div>Mocked Header</div>);

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('UserPage Component', () => {
  test('renders user profile form', () => {
    render(<UserPage />);
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });
});