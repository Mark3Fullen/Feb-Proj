import React from "react";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const HomeAccordion = (comps) => {

    const {activeUser, setActiveUser, onUserSubmit, onUserLogin, updateUser, onUserPatch, setUserPatchName, onUserDelete, errorMSG} = comps;

    return (
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
    )

}

export default HomeAccordion