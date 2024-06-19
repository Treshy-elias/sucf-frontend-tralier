import { useEffect, useState } from 'react';
import './UserDetail.css';
import axios from 'axios';
import { FaBookReader, FaTimes, FaUser, FaUserSecret } from 'react-icons/fa';
import { FaDemocrat, FaTrashCan } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePhone, AiOutlineCalendar } from 'react-icons/ai';
import { MdOutlineSchool } from 'react-icons/md';
import { FaHome, FaTransgenderAlt, FaBuilding, FaChurch } from 'react-icons/fa';
import { GiBookshelf } from 'react-icons/gi';
import { WarningNote, MessageNote } from './WarningNote';

const UserDetail = ({ updateUser, getAllUsers, deleteUser, uploadImage }) => {
  const [selectedUserId, setSelectedUserId] = useState(JSON.parse(localStorage.getItem('selectedUser')) || {});
  const [userId, setUserId] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [selectedUser, setSelectedUser] = useState(selectedUserId || {});
  const [userDetail, setUserDetail] = useState(userId || {});
  const [currentUser, setCurrentUser] = useState(false);
  const [makeChange, setMakeChange] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [adminMenu, setAdminMenu] = useState(false);
  const [warning, setWarning] = useState(false);
  const [addExcos, setAddExcos] = useState(false);
  const [addAdmin, setAddAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [file, setFile] = useState();
  const [changeImage, setChangeImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const [data, setData] = useState({
    department: '',
    birthday: '',
    homeAdd: '',
    currentLev: '',
    gender: '',
    schAdd: '',
    role: '',
    adminStatus: userDetail.isAdmin || false,
    currentUserId: userDetail._id || ''
  });

  const toggleAdminMenu = () => {
    setAdminMenu(!adminMenu);
  };

  const toggleImageUpload = () => {
    if (selectedUser._id === userDetail._id) {
      setChangeImage(!changeImage);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseSelected = await axios.get(`${getAllUsers}/${selectedUserId._id}`);
        const responseUser = await axios.get(`${getAllUsers}/${userId._id}`);
        setSelectedUserId(responseSelected.data);
        setUserId(responseUser.data);
        setSelectedUser(responseSelected.data);
        setUserDetail(responseUser.data);
        localStorage.setItem('selectedUser', JSON.stringify(responseSelected.data));
        localStorage.setItem('user', JSON.stringify(responseUser.data));
      } catch (error) {
        console.error('Error fetching user details:', error);
        const updatedUser = JSON.parse(localStorage.getItem('selectedUser'));
        const updatedUser2 = JSON.parse(localStorage.getItem('user'));
        setSelectedUserId(updatedUser || {});
        setUserId(updatedUser2 || {});
      }
    };

    fetchData();
  }, [getAllUsers, selectedUserId._id, userId._id]);

  useEffect(() => {
    if (selectedUser && userDetail && selectedUser._id === userDetail._id) {
      setData({
        department: userDetail.department || '',
        birthday: userDetail.birthday || '',
        homeAdd: userDetail.homeAdd || '',
        gender: userDetail.gender || '',
        schAdd: userDetail.schAdd || '',
        role: userDetail.role || '',
        currentLev: userDetail.currentLev || '',
        adminStatus: userDetail.isAdmin,
        currentUserId: userDetail._id
      });
    } else if (selectedUser) {
      setData({
        department: selectedUser.department || '',
        birthday: selectedUser.birthday || '',
        homeAdd: selectedUser.homeAdd || '',
        gender: selectedUser.gender || '',
        schAdd: selectedUser.schAdd || '',
        role: selectedUser.role || '',
        currentLev: selectedUser.currentLev || '',
        adminStatus: selectedUser.isAdmin,
        currentUserId: selectedUser._id
      });
    }
  }, [selectedUser, userDetail]);

  useEffect(() => {
    if (selectedUser && userDetail && selectedUser._id === userDetail._id) {
      setCurrentUser(true);
    } else {
      setCurrentUser(false);
    }
  }, [selectedUser, userDetail]);

  const handleData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.put(`${updateUser}/${userDetail._id}`, data, {
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });
      setIsLoading(false);
      setInfo(true);
      setInfoMessage('Update Successful');
      localStorage.setItem('selectedUser', JSON.stringify(response.data));
      setTimeout(() => {
        setInfo(false);
        window.location.reload();
      }, 3000);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      setInfo(true);
      setInfoMessage(error.message + '. Check Network connection');
      setTimeout(() => {
        setInfo(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    const data = {
        currentUserId: userDetail._id,
        adminStatus: userDetail.isAdmin
    };
    console.log(data);
    setDeleting(true)
    console.log('starting');
    try {
        const response = await axios.delete(`${deleteUser}/${selectedUser._id}`, {
            data, // This is how you send data with a DELETE request
            onDownloadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            }
        });

        console.log('success');
        console.log(response);
        setTimeout(() => {
            localStorage.setItem('selectedUser', '');
            if (currentUser) {
                navigate('/login');
            }
            else if (userDetail.isAdmin) {
                navigate('/');
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
            }
        }, 3000);
    } catch (error) {
        console.log(error);
        setInfo(true);
        setInfoMessage(error.message + '. Check Network connection');
        setDeleting(false)
    }
}

const handleWarning = () => {
  setWarning(!warning)
}
const handleAddExcosOrAdmin = async (type) => {
  // let data = {
  //   currentUserId: userDetail._id,
  //   adminStatus: userDetail.isAdmin
    
  // };

  if (type === 'excos') {
    data.isExcos = !selectedUser.isExcos;
    setAddExcos(true)
  } else if (type === 'admin') {
    data.isAdmin = !selectedUser.isAdmin;
    setAddAdmin(true)
  }

  try {
    const response = await axios.put(`${updateUser}/${selectedUser._id}`, data, {
      onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percentCompleted);
          }
      }
    });

    console.log(response.data);
    localStorage.setItem('selectedUser', JSON.stringify(response.data));
    localStorage.setItem('user', JSON.stringify(response.data));
    setTimeout(() => {
      window.location.reload();
    }, 3000);

    setInfo(true);
    setInfoMessage("Request processed Successfully")
    setAddAdmin(false)
    setAddExcos(false)
  } catch (error) {
    console.log(error);
    setInfo(true);
    setInfoMessage(error.message + '. Check Network connection');
    setTimeout(() => {
      setInfo(false);
    }, 3000);
    setAddAdmin(false)
    setAddExcos(false)
  } 
}

  const handleEditMode = () => {
    if (userDetail._id == selectedUser._id) {
    makeChange ? null : setInfo(true), setInfoMessage("Go to the edit button below to edit")
    setTimeout(() => {
      setInfo(false)
    }, 2000);
    }

  }



  const [src, setSrc] = useState('');

  useEffect(() => {
    if (file) {
      const fileSrc = URL.createObjectURL(file);
      setSrc(fileSrc);
      console.log(file);
      console.log(fileSrc);
    }
  }, [file]);

  const imageHandleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    try {
      const formDataImage = new FormData();
      formDataImage.append('image', file);
      const imageResponse = await axios.post(`${uploadImage}`, formDataImage);
      setChangeImage(false)
      setInfo(true)
      setInfoMessage(imageResponse.data.message)



      const data = {
        ImageUrl: `${imageResponse.data.fileUrl}`,
        adminStatus: userDetail.adminStatus,
        currentUserId: userDetail._id
      }
      const response = await axios.put(`${updateUser}/${selectedUser._id}`, data, {
        onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            }
        }
      });

      console.log(response)
      localStorage.setItem('selectedUser', JSON.stringify(response.data));
      localStorage.setItem('user', JSON.stringify(response.data));

      setTimeout(() => {
        window.location.reload()
      }, 2000);




      setTimeout(() => {
        setInfo(false)
      }, 2000);
      console.log(imageResponse.data.fileUrl);
    } catch (error) {
      setChangeImage(false)
      console.log(error);
      setInfo(true)
      setInfoMessage(error.message)
      setTimeout(() => {
        setInfo(false)
      }, 2000);
    }
  };


  return (
    <div className='userDetail'>
      {selectedUser ? 
        <form onSubmit={handleSubmit} className="housing-detail">
          {info ? 
          <div className="warningB">
          <MessageNote message={infoMessage}/>
          
        </div>
          :
            null
          }

          {userDetail.isAdmin ?
 <div className="userOption">
 <FaUserSecret onClick={toggleAdminMenu} style={{color: `${adminMenu ? 'blue' : 'gray'}`}} className='moreVert' size={25}/>
 <div style={{display: `${adminMenu ? 'flex' : 'none'}`}} className="optionListB">
   <div  className="optionList">
    {/* <p>{info ? infoMessage : <></>}</p> */}
    <div onClick={() => handleAddExcosOrAdmin('excos')} className='lists'>
        <FaBookReader />
        <p>{addExcos ? `Loading ${progress}%` : (selectedUser.isExcos ? 'Remove user from Excos' : 'Make User Excos')}</p>
      </div>
      <div onClick={() => handleAddExcosOrAdmin('admin')} className='lists'>
        <FaUser />
        <p>{addAdmin ? `Loading ${progress}%` : (selectedUser.isAdmin ? 'Remove user from Admin' : 'Make User Admin')}</p>
      </div>
      <div onClick={handleWarning} className='lists'>
        <FaTrashCan color='red' />
        <p style={{ color: 'red' }}>{deleting ? `Deleting ${progress}%` : 'Delete Account'}</p>
      </div>

     {warning ? 
                <div className="warningB">
                <WarningNote handleDeleteUser={handleDeleteUser} handleWarning={handleWarning}/>
              </div>
      : null}
   </div>
 </div>
</div>
          :
          null
          }
          <div style={{backgroundImage: `url(${selectedUser.ImageUrl})`}} onClick={toggleImageUpload} className="img deImg"></div>
          {changeImage ?
          <div className="warningB">
          <form className='uploadForm' action="">
          <FaTimes onClick={toggleImageUpload} size={20}/>
          <div style={{backgroundImage: `url(${src ? src : selectedUser.ImageUrl})`}} className="img deImg"></div>
          <input className='uploadInput' required onChange={imageHandleChange} placeholder='Choose thumbnail file' type="file" accept='image/*' name="audio" id="" />
          <div onClick={submitImage} className="imageUploadBtn">submit</div>
          </form>
          </div>
          :
            null
          }
        
          
          <div className="name">{selectedUser.firstname} {selectedUser.lastname}</div>
          <div className="position">{selectedUser.role}</div>
          <div onClick={handleEditMode} className="newInputs">
            <div className="Info">
              <h6>Contact info</h6>
              <div className="icons-text">
                <AiOutlinePhone/>
              <input  className={`deInput ${makeChange ? '' : 'noEvent'}`} placeholder='email' value={selectedUser.email || ''} readOnly type="text" />
              </div>
            </div>
            <div className="Info">
              <h6>Role as Excos in Sucf</h6>
              <div className="icons-text">
                <FaChurch/>
              <input value={data.role} onChange={handleData} className={`deInput ${makeChange ? '' : 'noEvent'}`} name='role' placeholder='e.g Data secretary' type="text" />
            </div>
              </div>

            <div className="Info">
              <h6>Education</h6>
              <div className="icons-text">
                <FaBuilding/>
                <input value={data.department} onChange={handleData} className={`deInput ${makeChange ? '' : 'noEvent'}`} name='department' placeholder='Department in school' type="text" />
              </div>
              <div className="icons-text">
                <GiBookshelf/>
              <input value={data.currentLev} onChange={handleData} className={`deInput ${makeChange ? '' : 'noEvent'}`} name='currentLev' placeholder='Level e.g 100L' type="number" />
              </div>
            </div>
           
          <div className="Info">
            <h6>Places Lived</h6>
            <div className="icons-text">
              <FaHome/>
              {makeChange ? 
                <input value={data.homeAdd} style={{width: '100%'}} onChange={handleData} className={`deInput ${makeChange ? '' : 'noEvent'}`} name='homeAdd' placeholder='Original Home Address' type="text" />
                :
                <div className='div-input'>{data.homeAdd}</div>
              }
            </div>
            <div className="icons-text">
              <MdOutlineSchool/>
              {makeChange ? 
                <input value={data.schAdd} style={{width: '100%'}} onChange={handleData} className={`deInput ${makeChange ? '' : 'noEvent'}`} name='schAdd' placeholder='Home address here in school' type="text" />
                :
                <div className='div-input'>{data.schAdd}</div>
              }
            
            </div>
          </div>
          <div className="Info">
            <h6>Basic info</h6>
            <div className="icons-text">
              <AiOutlineCalendar/>
            <input value={data.birthday} onChange={handleData} className={`deInput text-wrap ${makeChange ? '' : 'noEvent'}`} name='birthday' placeholder='Birthday e.g May 20th' type="text" />
            </div>
            <div className="icons-text">
              <FaTransgenderAlt/>
            <select value={data.gender} onChange={handleData} name="gender" className={`deInput ${makeChange ? '' : 'noEvent'}`}>
              <option value="">Pick your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            </div>
          </div>
           
            
            
          </div>
          {currentUser ? 
            makeChange === false ? 
              <div onClick={() => setMakeChange(true)} className="edit-form">Edit</div> :
              <div className="btns">
                <button type='submit'>{isLoading ? `Loading ${progress}%` : 'Submit'}</button>
                <div onClick={() => setMakeChange(false)} className='cancel'>cancel</div>
              </div> : 
            null
          }
          {currentUser ?
          <div className="user-delete">
          <span onClick={handleWarning}  className='check-attendance'>{deleting ? `Deleting ${progress}%` : 'Delete my Account '}
          </span>
          {warning ?
          <div className="warningB">
            <WarningNote handleDeleteUser={handleDeleteUser} handleWarning={handleWarning}/>
          </div>
          :
          null
          }
          
          </div>
       
         
           : null}
        </form> : 
        null
      }
    </div>
  )
}

export default UserDetail
