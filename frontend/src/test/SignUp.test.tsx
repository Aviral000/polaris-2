import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from '../pages/SignUp';

jest.mock('../components/Header', () => () => <div>Mocked Header</div>);

jest.mock('react-router-dom', () => ({
  Link: () => <div />,
  useNavigate: () => jest.fn(),
}));

describe('SignUp Component', () => {
  test('renders signup form', () => {
    render(<SignUp />);
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SignUp' })).toBeInTheDocument();
  });
});