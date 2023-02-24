import './App.css';

import React, { useState } from 'react';
import { useNavigate } from "react-router";

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const App = () => {
  
  const nav = useNavigate();
  localStorage.setItem('token', token);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const [menuClicked, setMenuClicked] = useState(false);
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
    .then(() => {
      setActiveUser(newPerson);
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
    .then(() => {
      setUser({ name: "", email: "", password: ""});
      nav('/');
    })
    .catch(e => {
      window.alert(e);
      console.log(e);
      return;
    })
  }

  return (
    <Box className="homeApp">
      <div className="homeHeader">
        <MenuOutlinedIcon className='homeAppMenu' onClick={() => setMenuClicked(true)}/>
        <Fab variant="extended" size="large" aria-label="add">App Name</Fab> 
      </div>

      <Drawer open={menuClicked} anchor="left" variant="persistent" sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            alignItems: 'center',
            padding: '50px',
          },}}>

            <Stack className='homeMenuStack' spacing={2}>

              <MenuOutlinedIcon className='homeMenuMenu' onClick={() => setMenuClicked(false)}/>

              <form onSubmit={onUserSubmit}>
                <TextField label="Full Name" variant="standard" onChange={e => updateUser({ name: e.target.value })}/>
                <TextField label="Email" variant="standard" onChange={e => updateUser({ email: e.target.value })}/>
                <TextField label="Password" variant="standard" onChange={e => updateUser({ password: e.target.value })}/>
                <Button type="submit" variant="contained">Create User</Button>
              </form>

              <form onSubmit={onUserLogin}>
                <TextField label="Email" variant="standard" onChange={e => updateUser({ email: e.target.value })}/>
                <TextField label="Password" variant="standard" onChange={e => updateUser({ password: e.target.value })}/>
                <Button type="submit" variant="contained">Login</Button>
              </form>

              <h4>{activeUser.name ? activeUser.name : "Not Logged in"}</h4>

            </Stack>

        

      </Drawer>

      <div className="homeBody">

      </div>

    </Box>
  );
}

export default App;
