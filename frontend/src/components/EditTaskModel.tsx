import React, { useEffect, useState } from 'react';
import '../styles/EditTaskModel.scss';
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

export default function EditTaskModal() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
      setTitle(response.data.title);
      setDescription(response.data.description);
    } catch (error) {
      alert(error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://127.0.0.1:8082/u1/api/tasks/update/${id}`, 
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/task');
    } catch (error) {
      alert(error);
    }
  };

  const handleClose = () => {
    navigate('/task');
  };

  return (
    <main>
      <div className='ET-A1'>
        <div className='ET-B1'>Edit Task</div>
        {task ? (
          <>
            <div className='ET-B2'>
              <label htmlFor="title">Title</label>
              <div className='ET-C1'>
                <input 
                  type="text" 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder={task.title} 
                />
              </div>
            </div>
            <div className='ET-B3'>
              <label htmlFor="description">Description</label>
              <div className='ET-C1'>
                <textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder={task.description}
                />
              </div>
            </div>
            <div className='ET-B4'>
              <button type='button' onClick={handleSave}>Save</button>
              <button type='button' onClick={handleClose}>Close</button>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </main>
  );
}
