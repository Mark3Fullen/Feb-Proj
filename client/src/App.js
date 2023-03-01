import './App.css';

import React, { useState } from 'react';
import { useNavigate } from "react-router";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const App = () => {
  
  const nav = useNavigate();

  let token = ""
  
  // let authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [activeUser, setActiveUser] = useState({})
  const [userPatchName, setUserPatchName] = useState("")
  const [errorMSG, setErrorMSG] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  // console.log(token)
  // console.log(activeUser)
  // console.log(errorMSG)

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
          nav('/');
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
      nav('/');
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
    <Box className="homeApp">
      <div className="homeHeader">
        <Fab variant="extended" size="large" aria-label="add">App Name</Fab>
        <Box className="userSettingsBox">
          <Accordion>

            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Account</Typography>
            </AccordionSummary>

            <AccordionDetails className='userSettingDetails'>
              {(!Object.keys(activeUser).length < 1) ? <div>
                <Typography>{`Welcome ${activeUser.name}`}</Typography>
                <Button variant="contained" onClick={() => {
                  localStorage.removeItem('activeUser');
                  localStorage.removeItem('token');
                  setActiveUser("");              
                }}>Logout</Button>
              </div> : <div>
                <form className='userForm' onSubmit={onUserSubmit}>
                  <TextField label="Full Name" variant="standard" onChange={e => updateUser({ name: e.target.value })}/>
                  <TextField label="Email" variant="standard" onChange={e => updateUser({ email: e.target.value })}/>
                  <TextField label="Password" variant="standard" onChange={e => updateUser({ password: e.target.value })}/>
                  <Button type="submit" variant="contained">Create User</Button>
                </form>

                <br/>

                <Typography>Or</Typography>

                <br/>

                <form className='userForm' onSubmit={onUserLogin}>
                  <TextField label="Email" variant="standard" onChange={e => updateUser({ email: e.target.value })}/>
                  <TextField label="Password" variant="standard" onChange={e => updateUser({ password: e.target.value })}/>
                  <Button type="submit" variant="contained">Login</Button>
                </form>
                {errorMSG.length > 0 ? errorMSG : null}
              </div>}
            </AccordionDetails>

          </Accordion>
          <Accordion>

            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Settings</Typography>
            </AccordionSummary>

            <AccordionDetails className='userSettingDetails'>
              {(Object.keys(activeUser).length < 1) ? "Please login or register" : 
                <div>
                  <form onSubmit={onUserPatch}>
                    <TextField type="text" label="Name" variant="standard" onChange={(e) => setUserPatchName(e.target.value)}/>
                    <Button type="submit" variant="contained">Change Name</Button>
                  </form>
                  <Button variant="contained" onClick={e => onUserDelete(e)}>Delete User</Button>
                </div>}
            </AccordionDetails>

          </Accordion>
        </Box>
        <Box className="userDrawerBox">
          <MenuOutlinedIcon onClick={() => setDrawerOpen(true)} />
          <Drawer open={drawerOpen} sx={{
            width: '350px',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: '350px',
              boxSizing: 'border-box',
            },
          }}>
            <Stack className='drawerStack'>

              <MenuOutlinedIcon onClick={() => setDrawerOpen(false)} />

              <br/>

              <p>Bruh</p>

              <br/>

              <p>Moment</p>

            </Stack>

          </Drawer>
        </Box>   
      </div>

      <div className="homeBody">

      </div>

    </Box>
  );
}

export default App;
