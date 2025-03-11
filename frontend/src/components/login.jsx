import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email,setEmail] = useState("");
  const navigate = useNavigate();
  
  const onSubmit = async() => {
     const response = await axios.get('http://localhost:3000/login',{
      email
     })
     console.log(response.data);
     navigate('/Dashboard');
  }
  return (
    <div>Signup
       <input 
       type="text" 
       placeholder='Enter your name'
       value = {email}
       onChange={(e)=>{setEmail(e.target.value)}}
       />
       <button onClick={onSubmit}>Login</button>
    </div>
  )
}

export default Login