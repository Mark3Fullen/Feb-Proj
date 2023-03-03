import './css/App.css';
import HomeDrawer from './Comps/HomeDrawer';
import UserPage from './Comps/UserPage'
import HomePage from './Comps/HomePage'
import AboutPage from './Comps/AboutPage'
import HomeAccordion from './Comps/HomeAccordion';

import React, { useState, useEffect, useRef } from 'react';
import { Link, BrowserRouter, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';

const App = () => {

  let token = ""
  
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [activeUser, setActiveUser] = useState({})
  const [userPatchName, setUserPatchName] = useState("")
  const [errorMSG, setErrorMSG] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef(null);
  const firstClickRef = useRef(true);

  useEffect(() => {

    const handleClickOutsideDrawer = (event) => {
      if (!firstClickRef.current && drawerOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false)
      }
      firstClickRef.current = false
    }

    document.addEventListener('click', handleClickOutsideDrawer);

    return () => {
      document.removeEventListener('click', handleClickOutsideDrawer);
    }
  }, [drawerOpen])

  const updateUser = (v) => {
    return setUser((prev) => {
      console.log({...user, ...v});
      return {...user, ...v};
    });
  }

  async function onUserSubmit(e) {
    e.preventDefault();
    setErrorMSG("");

    const newPerson = {...user};

    if (!newPerson.name.length > 0 || !newPerson.password.length > 0 || !newPerson.email.length > 0) {
      setErrorMSG("Please add credentials")
      setTimeout(() => setErrorMSG(""), 3000);
      return;
    }

    await fetch("http://localhost:5000/user/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
    .then(res => {
      console.log(res.status)
      if (res.status === 200) {
        return res.json().then((res) => {
          console.log(res);
          token = res.token;
          localStorage.setItem('token', token);
          setActiveUser(res.savedUser);
          console.log({ activeUser} , localStorage.getItem('token'));
          setUser({ name: "", email: "", password: ""});
        })
      } else {
        return res.json().then((err) => {
          setErrorMSG(err.message);
          setTimeout(() => setErrorMSG(""), 3000);
          throw new Error(err.message);
        })
      }
    })
    .catch(e => {
      console.log(e);
    });
  }

  async function onUserLogin(e) {
    e.preventDefault();
    setErrorMSG("");

    const login = { email: user.email, password: user.password};

    if (!login.email || !login.password) {
      setErrorMSG("Please add credentials");
      setTimeout(() => setErrorMSG(""), 3000);
      return;
    }

    await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    })
    .then((res) => {
      console.log(res.status)
      if (res.status === 200) {
        return res.json()
      } else {
        return res.json().then(err => {
          setErrorMSG(err.message ? err.message : null);
          setTimeout(() => setErrorMSG(""), 3000);
          throw new Error(err.message);
        });    
      }
    })
    .then((res) => {
      token = res.token;
      localStorage.setItem('token', token);
      console.log(localStorage.getItem('token'));
      setActiveUser(res.user);
      setUser({ name: "", email: "", password: ""});
    })
    .catch((e) => {
      console.log(e);
    })
  }

  async function onUserPatch(e) {
    e.preventDefault();

    const userId = activeUser._id;
    
    await fetch(`http://localhost:5000/user/${userId}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name: userPatchName}),
    })
    .then(res => res.json())
    .then(res => {
      setActiveUser(res.user);
    })
    .catch(err => console.error('Error patching', err))
  }

  async function onUserDelete(e) {
    e.preventDefault();

    const userId = activeUser._id;
  
    await fetch(`http://localhost:5000/user/${userId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      !res.ok ? console.log("Server Error") : console.log("Successfully deleted")
      setActiveUser({});
    })
    .catch(err => {
      console.error('Error deleting', err);
    })
  }

  return (
    <BrowserRouter>

      <Box className="homeApp">

        <div className="homeHeader">

          <Link to="/">
            <Fab variant="extended" size="large" aria-label="add">App Name</Fab>
          </Link>
          
          <HomeAccordion activeUser={activeUser} setActiveUser={setActiveUser} onUserSubmit={onUserSubmit} onUserLogin={onUserLogin} updateUser={updateUser} onUserPatch={onUserPatch} setUserPatchName={setUserPatchName} onUserDelete={onUserDelete} errorMSG={errorMSG}/>

          <HomeDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} drawerRef={drawerRef} firstClickRef={firstClickRef} activeUser={activeUser}/>

        </div>

        <div className="homeBody"> 
        
            <Routes>
              <Route path="/" element={<HomePage/>}/>
            </Routes>
            <Routes>
              <Route path="/user" element={<UserPage user={activeUser}/>}/>
            </Routes>
            <Routes>
              <Route path="/about" element={<AboutPage/>}/>
            </Routes>

        </div>

      </Box>

    </BrowserRouter>
  );
}

export default App;
