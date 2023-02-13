import './home.css';

import Fab from '@mui/material/Fab';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

function App() {
  return (
    <div className="homeApp">
      <div className="homeHeader">
        <MenuOutlinedIcon className='homeAppMenu'/>
        <Fab variant="extended" size="large" aria-label="add">App Name</Fab> 
      </div>

      <div className="homeBody">

      </div>

    </div>
  );
}

export default App;
