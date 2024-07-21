import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import '../styles/TaskPage.scss';

interface Task {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function TaskPage() {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem('loggedIn');
  const token = localStorage.getItem('token');
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (loggedIn && token) {
      fetchTasks();
    } else {
      navigate('/login');
    }
  }, [loggedIn, token, navigate]);

  useEffect(() => {
    filterAndSortTasks();
  }, [searchTerm, sortBy, tasks]);

  useEffect(() => {
    const savedTodoTasks = localStorage.getItem('todoTasks');
    const savedInProgressTasks = localStorage.getItem('inProgressTasks');
    const savedDoneTasks = localStorage.getItem('doneTasks');

    if (savedTodoTasks) {
      setTodoTasks(JSON.parse(savedTodoTasks));
    }
    if (savedInProgressTasks) {
      setInProgressTasks(JSON.parse(savedInProgressTasks));
    }
    if (savedDoneTasks) {
      setDoneTasks(JSON.parse(savedDoneTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(todoTasks));
    localStorage.setItem('inProgressTasks', JSON.stringify(inProgressTasks));
    localStorage.setItem('doneTasks', JSON.stringify(doneTasks));
  }, [todoTasks, inProgressTasks, doneTasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://polaris-2.onrender.com/u1/api/tasks/view', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fetchedTasks = response.data;
      setTasks(fetchedTasks);

      const todo: Task[] = [];
      const inProgress: Task[] = [];
      const done: Task[] = [];

      fetchedTasks.forEach((task: Task) => {
        const column = determineTaskColumn(task);
        if (column === 'todo') {
          todo.push(task);
        } else if (column === 'in-progress') {
          inProgress.push(task);
        } else if (column === 'done') {
          done.push(task);
        }
      });

      setTodoTasks(todo);
      setInProgressTasks(inProgress);
      setDoneTasks(done);
    } catch (error) {
      handleApiError(error);
    }
  };

  const determineTaskColumn = (task: Task): string => {
    return 'todo';
  };

  const filterAndSortTasks = () => {
    let result = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'last') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredTasks(result);
  };

  const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 401) {
        setError('Authorization error');
        handleLogout();
      } else {
        setError('An error occurred');
      }
    } else {
      setError('An unexpected error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    navigate('/login');
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    const task: Task = JSON.parse(e.dataTransfer.getData('task'));

    if (columnId === 'todo') {
      setTodoTasks(prev => [...prev, task]);
      setInProgressTasks(prev => prev.filter(t => t._id !== task._id));
      setDoneTasks(prev => prev.filter(t => t._id !== task._id));
    } else if (columnId === 'in-progress') {
      setInProgressTasks(prev => [...prev, task]);
      setTodoTasks(prev => prev.filter(t => t._id !== task._id));
      setDoneTasks(prev => prev.filter(t => t._id !== task._id));
    } else if (columnId === 'done') {
      setDoneTasks(prev => [...prev, task]);
      setTodoTasks(prev => prev.filter(t => t._id !== task._id));
      setInProgressTasks(prev => prev.filter(t => t._id !== task._id));
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const renderTasks = (tasks: Task[]) => {
    return tasks.map(task => (
      <div
        key={task._id}
        className='task-item'
        draggable
        onDragStart={(e) => onDragStart(e, task)}
      >
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p>Created At: {new Date(task.createdAt).toLocaleString()}</p>
        <div className="task-actions">
          <button style={{ backgroundColor: 'blue' }} onClick={() => navigate(`/view-task/${task._id}`)}>View</button>
          <button onClick={() => navigate(`/edit-task/${task._id}`)}>Edit</button>
          <button style={{ backgroundColor: 'red' }} onClick={() => handleDelete(task._id)}>Delete</button>
        </div>
      </div>
    ));
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`https://polaris-2.onrender.com/u1/api/tasks/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
      setTodoTasks(todoTasks.filter(task => task._id !== taskId));
      setInProgressTasks(inProgressTasks.filter(task => task._id !== taskId));
      setDoneTasks(doneTasks.filter(task => task._id !== taskId));
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <main>
      <Header />
      <div className='TK-A1'>
        {loggedIn ? (
          <div className='TK-B1'>
            <div className='TK-C1'>
              <button type='button' onClick={() => navigate('/add-task')}>Add Task</button>
            </div>
            <div className='TK-C2'>
              <div className='TK-D1'>
                <label htmlFor="search">Search: </label>
                <input type="text" placeholder='Search title...' onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className='TK-D2'>
                <label htmlFor="sortby">Sort By:</label>
                <select id="sortby" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="recent">Recent</option>
                  <option value="last">Last</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
            <div className='TK-C3'>
              <div
                className='column'
                onDrop={(e) => onDrop(e, 'todo')}
                onDragOver={onDragOver}
              >
                <div className='column-title'>TODO</div>
                {renderTasks(todoTasks)}
              </div>
              <div
                className='column'
                onDrop={(e) => onDrop(e, 'in-progress')}
                onDragOver={onDragOver}
              >
                <div className='column-title'>IN PROGRESS</div>
                {renderTasks(inProgressTasks)}
              </div>
              <div
                className='column'
                onDrop={(e) => onDrop(e, 'done')}
                onDragOver={onDragOver}
              >
                <div className='column-title'>DONE</div>
                {renderTasks(doneTasks)}
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        ) : (
          <div>
            <p>You are not logged in. Redirecting to login...</p>
          </div>
        )}
      </div>
    </main>
  );
}
