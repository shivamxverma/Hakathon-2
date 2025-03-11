import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [name,setName] = useState("");
  const [password,setPassword] = useState("");

  const onSubmit = async() => {
     await axios.post('http://localhost:3000/signin',{
      email,name,password
     })
     console.log('signup ho gya');
     navigate("/Dashboard");
     
  }
  return (
    <div>Signup
       <input 
       type="text" 
       placeholder='Enter your Email'
       value = {email}
       onChange={(e)=>{setEmail(e.target.value)}}
       />
       <input 
       type="text" 
       placeholder='Enter your name'
       value = {name}
       onChange={(e)=>{setName(e.target.value)}}
       />
       <input 
       type="text" 
       placeholder='Enter your Password'
       value = {password}
       onChange={(e)=>{setPassword(e.target.value)}}
       />
       <button onClick={onSubmit}>Signup</button>
    </div>
  )
}

export default Signup