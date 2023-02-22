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

  const [menuClicked, setMenuClicked] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  })

  const nav = useNavigate();

  const updateUser = (v) => {
    return setUser((prev) => {
      return {...user, ...v};
    });
  }

  async function onUserSubmit(e) {
    e.preventDefault();

    const newPerson = {...user};

    await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
    .catch(e => {
      window.alert(e);
      return;
    });

    setUser({ name: "", email: "", password: "" });
    nav('/');
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

              <form>

              </form>

            </Stack>

        

      </Drawer>

      <div className="homeBody">

      </div>

    </Box>
  );
}

export default App;
