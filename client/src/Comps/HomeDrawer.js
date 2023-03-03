import React from "react";
import { Link } from 'react-router-dom';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const HomeDrawer = (comps) => {

    const {setDrawerOpen, drawerOpen, drawerRef, firstClickRef, activeUser} = comps

    return (
        <Box className="userDrawerBox">
            <MenuOutlinedIcon onClick={() => {
              setDrawerOpen(!drawerOpen);
              firstClickRef.current = true;
              }} />
            <Drawer anchor='left' open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{
              width: '350px',
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: '350px',
                boxSizing: 'border-box',
              },
            }}>
              <Stack className='drawerStack' ref={drawerRef}>

                {Object.keys(activeUser).length > 0 ? <Link to="/user">
                  <Button variant="contained">User Menu</Button>
                </Link> : null}
                
                <Link to="/about">
                  <Button variant="contained">About Page</Button>
                </Link>

              </Stack>

            </Drawer>
          </Box>
    )

}

export default HomeDrawer;