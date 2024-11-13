import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import logo from '../Assests/logo.png';
import './Navbar.css';

const pages = ['Services', 'About Us', 'FAQs'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo on the Left Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img className="logo" src={logo} alt="Logo" style={{ marginRight: '10px' }} />
          </Box>

          {/* Tagline in the Center */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' }, // Show only on medium and larger screens
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 600,
                color: '#344655',
                fontSize: '16px',
                textAlign: 'center',
              }}
            >
              Say Good - Bye to Empty Rooms - Get WELRM and Fill Your Hotel Today!
            </Typography>
          </Box>

          {/* Navigation Items on the Right Side */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ color: '#344655', fontSize: '16px', padding: '5px 10px' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Toggle Button for Small Screens */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'flex-end' }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Menu for Small Screens */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
