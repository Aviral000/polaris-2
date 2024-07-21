import React, { useEffect, useState } from 'react';
import '../styles/ViewTaskModel.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description: string;
  taskNumber: number;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
}

export default function ViewTaskModal() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (id) {
      apiCall();
    }
  }, [id]);

  const apiCall = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8082/u1/api/tasks/view/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTask(response.data);
    } catch (error) {
      alert(error);
    }
  }

  const handleClose = () => {
    navigate('/task');
  }

  return (
    <main>
      <div className='VT-A1'>
        <div className='VT-B1'>Task Details</div>
        {task ? (
          <>
            <div className='VT-B2'>Title: {task.title}</div>
            <div className='VT-B3'>Description: {task.description}</div>
            <div className='VT-B4'>Created at: {new Date(task.createdAt).toLocaleString()}</div>
          </>
        ) : (
          <div>Loading...</div>
        )}
        <div className='VT-B5'>
          <button type='button' onClick={handleClose}>Close</button>
        </div>
      </div>
    </main>
  );
}
