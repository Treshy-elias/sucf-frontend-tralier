import { useState } from 'react';
import './AddUsers.css'
import axios from 'axios';
import { MessageNote } from '../UserDetail/WarningNote';

const AddUsers = ({authRegister}) => {
  const [isExcos, setIsExcos] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [info, setInfo] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [data, setData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    department: '',
    currentLev: '',
    isExcos: false, // Default is false
    role: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', data);
    
    // Ensure the latest isExcos value is properly set
    setData(prevData => ({ ...prevData, isExcos: isExcos }));
    
    try {
      setIsLoading(true)
      const response = await axios.post(`${authRegister}`, data, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });
      setIsLoading(false)
      setInfoMessage('User Added Successfully')
      setInfo(true)
      setTimeout(() => {
        setInfo(false)
      }, 2000);
      console.log(response.data)
    } catch (error) { 
        setIsLoading(false)
        setInfoMessage(`User not added: ${ error}`)
        setInfo(true)
        setTimeout(() => {
          setInfo(false)
        }, 2000);
    }
  };

  const handleData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Updated handleExcosChange to properly update both state and data
  const handleExcosChange = (e) => {
    const isExcosSelected = e.target.value === 'excos';
    setIsExcos(isExcosSelected);
    setData(prevData => ({ ...prevData, isExcos: isExcosSelected })); // Update data.isExcos
    console.log(data)
  };

  return (
    <div className='AddUsers'>
      {info ? 
        <div className="warningB">
          <MessageNote message={infoMessage}/>
        </div>
        : null
      }
      <form onSubmit={handleSubmit}>
        <h3>Add New User</h3>
        <input value={data.firstname} name='firstname' onChange={handleData} type="text" required placeholder='Firstname' />
        <input value={data.lastname} name='lastname' onChange={handleData} type="text" required placeholder='Surname' />
        <input value={data.email} name='email' onChange={handleData} type="number" required placeholder='Phone number' />
        <input value={data.department} name='department' onChange={handleData} type="text" required placeholder='Department' />
        <input value={data.currentLev} name='currentLev' onChange={handleData} type="number" required placeholder='Level' />
        
        {/* Show role input if isExcos is true */}
        {isExcos ? 
          <input value={data.role} name='role' onChange={handleData} type="text" required placeholder='Role as an Excos' /> 
          : null
        }

        <div>
          <input 
            type="radio" 
            name="role" 
            value="member"
            onChange={handleExcosChange}  // Handle the change event
            checked={!isExcos}  // Ensure checked state matches isExcos
          />
          Member
        </div>
        <div>
          <input 
            type="radio" 
            name="role" 
            value="excos" 
            onChange={handleExcosChange} // Handle the change event
            checked={isExcos}  // Ensure checked state matches isExcos
          />
          Excos
        </div>
        <button type='submit'>{isLoading?`loading...${progress}`:"Add"}</button>
      </form>
    </div>
  );
}

export default AddUsers;
