import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
  const [credentials,setCredentials] = useState({name:"",email:"",password:"",cpassword:""})
  const navigate = useNavigate()
  const handleSubmit = async(e)=>{
    e.preventDefault() 
    const {name,email,password} = credentials
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
      method: "POST",
      headers: {  
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name,email,password}),
    });
    const json = await response.json() 
    // console.log(json.authtoken)
    console.log(json.success)
    if(json.success){
      localStorage.setItem('token',json.authtoken)
      navigate("/")
      props.showAlert("Account created Successfully","success")
    }
    else{
      props.showAlert("Invalid Details","danger")
    }
  } 

    const onChange = (e)=>{
        setCredentials({...credentials,[e.target.name]: e.target.value} )
    }
  return (
    <div className='container mt-2'>
      <h2 className='my-2'>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" name='name' onChange={onChange} id="name" aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" name='email' onChange={onChange} id="exampleInputEmail1" aria-describedby="emailHelp"/>
          <div id="email" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" name='password' onChange={onChange} minLength={5} required id="password"/>
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" name='cpassword' onChange={onChange} minLength={5} required id="cpassword"/>
        </div>
        <button type="submit" className="btn btn-primary">SignUp</button>
      </form>
    </div>
  )
}

export default Signup
