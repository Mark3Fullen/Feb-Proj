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
  
  let authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [activeUser, setActiveUser] = useState({
    name: "",
    email: "",
    password: ""
  })

  const updateUser = (v) => {
    return setUser((prev) => {
      console.log({...user, ...v});
      return {...user, ...v};
    });
  }

  async function onUserSubmit(e) {
    e.preventDefault();

    const newPerson = {...user};

    await fetch("http://localhost:5000/user/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
    .then((res) => {
      token = res.data.token;
      localStorage.setItem('token', token);
      setActiveUser(res.data.user);
      setUser({ name: "", email: "", password: ""});
      nav('/');
    })
    .catch(e => {
      window.alert(e);
      console.log(e);
      return;
    });
  }

  async function onUserLogin(e) {
    e.preventDefault();

    const login = { email: user.email, password: user.password};

    await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    })
    .then((res) => {
      console.log(res.data.token)
      token = res.data.token;
      localStorage.setItem('token', token);
      setActiveUser(res.data.user);
      setUser({ name: "", email: "", password: ""});
      nav('/');
    })
    .catch(e => {
      window.alert(e);
      console.log(e);
      return;
    })
  }

  async function userDelete(e) {
    e.preventDefault();

    const userId = "";
  
    fetch(`http://localhost:5000/user/${userId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        authHeader,
      },
    })
    .then(res => {
      console.log("Successfully deleted")
    })
    .catch(err => {
      console.error('Error deleting', err);
    })


  }

  return (
    <Box className="homeApp">
      <div className="homeHeader">
        <Fab variant="extended" size="large" aria-label="add">App Name</Fab>
        <Box className="userSettings">
          <Accordion>

            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Account</Typography>
            </AccordionSummary>

            <AccordionDetails>
              {token.length > 0 ? activeUser.name : <div>
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
              </div>}
            </AccordionDetails>

          </Accordion>
          <Accordion>

            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Settings</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Button variant="contained" onClick={userDelete}>Delete User</Button>
            </AccordionDetails>

          </Accordion>
        </Box>   
      </div>

      <div className="homeBody">

      </div>

    </Box>
  );
}

export default App;
