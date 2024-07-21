import React from 'react'
import '../styles/OAuth.scss'
import { FaGoogle } from 'react-icons/fa'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import app from '../firebase'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
const navigate = useNavigate();
const auth = getAuth(app);

const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
        const resultsFromGoogle = await signInWithPopup(auth, provider);
        const { displayName, email } = resultsFromGoogle.user;

        const res = await axios.post("http://127.0.0.1:8082/u1/api/users/auth/google", {
            fullName: displayName,
            email
        });

        if(res.status === 200) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('loggedIn', res.data.loggedIn);
            navigate('/task');
        }
    } catch (error) {
        alert(error);
    }
}

  return (
    <div className='OAuth-1A'>
        <button type='button' onClick={handleGoogleClick}>
            <FaGoogle /> 
            Continue with google
        </button>
    </div>
  )
}
