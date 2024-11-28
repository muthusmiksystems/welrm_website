import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import logo from '../../Assests/logo.png';
import Basiclogo from "../../Assests/WELRM.png";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Actions/actions';
import { useDispatch } from 'react-redux';


function BasicInformation() {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const user = useSelector((state) => state.Auth);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (path) => {
    handleCloseUserMenu(); // Close the menu before navigating\
    if (path === 'Dashboard') {
      navigate('/dashboard/chart/today')
    }
    if (path === 'Logout') {
      dispatch(logout())
      navigate("/login");
    }
  };

  const username = user?.user?.user?.fullName ? user?.user?.user?.fullName : '';
  const hotelname = user?.user?.user?.hotel?.hotelName ? user?.user?.user?.hotel?.hotelName : '';
  const settings = hotelname ? [ 'Logout'] : [ 'Logout'];

  return (
    <AppBar position="static" style={{
      backgroundColor: "#eddddd",
      padding: "10px 10px"
    }}>
      <Container>
        <Toolbar disableGutters sx={{
          display: "flex",
          justifyContent: "space-between"
        }}>
          <Box sx={{
            width: { xs: "100px", sm: "130px", md: "150px" }, // Adjust width based on screen size
            height: "auto" // Keeps the aspect ratio intact
          }}>
            <img className='basi_logo' src={logo} alt="Logo" style={{
              width: "100%", // Ensures the logo takes up the full width of its container
              height: "auto", // Keeps the aspect ratio intact
              objectFit: "contain" // Ensures the logo doesn't get distorted
            }} />
          </Box>

          <Box sx={{
            flexGrow: 0,
            display: "flex",
            alignItems: "center" // Align logo and text vertically in the center
          }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <img style={{
                  width: "40px",
                  height: "40px",
                }} src={Basiclogo} alt="User Icon" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
            <Box sx={{
              marginLeft: "10px"
            }}>
              <Typography sx={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#273B4A"
              }}>{username}</Typography>
              <Typography sx={{
                fontSize: "12px",
                fontWeight: "400",
                color: "#273B4A"
              }}>{hotelname}</Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default BasicInformation;
