import './App.css';

import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Drawer from '@mui/material/Drawer';

const App = () => {

  const [menuClicked, setMenuClicked] = useState(false);

  return (
    <Box className="homeApp">
      <div className="homeHeader">
        <MenuOutlinedIcon className='homeAppMenu' onClick={() => setMenuClicked(true)}/>
        <Fab variant="extended" size="large" aria-label="add">App Name</Fab> 
      </div>

      <Drawer className='homeDrawer' open={menuClicked} anchor="left" variant="persistent" sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            alignItems: 'center',
            padding: '50px',
          },}}>
        <MenuOutlinedIcon className='homeMenuMenu' onClick={() => setMenuClicked(false)}/>

        <br/>

        

      </Drawer>

      <div className="homeBody">

      </div>

    </Box>
  );
}

export default App;
