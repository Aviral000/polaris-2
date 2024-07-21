import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskPage from '../pages/TaskPage';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
jest.mock('../components/Header', () => () => <div>Mocked Header</div>);

describe('TaskPage Component', () => {
  beforeEach(() => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('token', 'fake-token');

    (axios.get as jest.Mock).mockResolvedValue({
      data: [
        {
          _id: '1',
          title: 'Test Task',
          description: 'Test Task Description',
          taskNumber: 1,
          status: 'todo',
          createdAt: new Date().toISOString()
        }
      ]
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  test('renders task page elements', async () => {
    render(
      <MemoryRouter> {/* Wrap with MemoryRouter */}
        <TaskPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('TODO')).toBeInTheDocument();
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
    expect(screen.getByText('DONE')).toBeInTheDocument();
  });
});
