import React, { useState } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/SignUp.scss'
import OAuth from '../components/OAuth'

export default function SignUp() {
const navigate = useNavigate();

const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };

    validate(formData);

    try {
        const response = await axios.post('http://127.0.0.1:8082/u1/api/users/signup', formData);
        navigate('/login');
      } catch (err) {
        console.error('Error:', err);
      }
};

const validate = (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}): boolean => {
    if (!formData.firstName) {
        setError("First name is required");
        return false;
    }
    if (!formData.email) {
        setError("Email is required");
        return false;
    }
    if (!formData.password) {
        setError("Password is required");
        return false;
    }
    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
    }
    if (password.length < 7) {
        setError("Password length should be more than 7")
    }

    setError("");
    return true;
};

  return (
    <main>
        <Header />
        <div className='SP-A1'>
            <div className='SP-B1'>
                <div>SignUp</div>
            </div>
            <form className='SP-B2' onSubmit={handleSubmit}>
                <div className='SP-C1'>
                    <input type="text" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className='SP-C1'>
                    <input type="text" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className='SP-C1'>
                    <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='SP-C1'>
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='SP-C1'>
                    <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className='SP-C3'>
                    <button type='submit'>SignUp</button>
                </div>
                <div className='SP-C4'>Already have a account? <Link to='/login'><span className='SP-D1'>Login</span></Link></div>
                <div className='SP-C5'><OAuth /></div>
                {error && <div className='SP-C6'>{error}</div>}
            </form>
        </div>
    </main>
  )
}
