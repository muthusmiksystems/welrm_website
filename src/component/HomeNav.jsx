import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Grid, Button, IconButton, Drawer, List, ListItem, ListItemButton,
  ListItemText, Box, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import logo from '../Assests/logo.png';
import lo from '../Assests/lo.png';
import { Link } from "react-router-dom";

function Header({onAboutClick}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screen
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer

  // Toggle Drawer
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#c9b9b7', padding: '5px 0' }}>
        <Toolbar>
          <Grid container alignItems="center" sx={{
            justifyContent: {
              lg: 'space-between',  // Large screens: Space between items
              md: 'center',
              sm: 'center',
              xs: "space-between"
            },
          }}>
            {/* Logo Section */}
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={logo}
                alt="WELRM Logo"
                style={{ width: isMobile ? 80 : 110, height: isMobile ? 30 : 40, marginRight: '8px' }}
              />
            </Grid>

            {/* Tagline Section */}
            {!isMobile && (
              <Grid item>
                <Typography
                  variant="subtitle1"
                  sx={{ color: '#333', fontWeight: 600, textAlign: 'center',fontSize:'16px',marginLeft:{lg:'100px',md:'0px'} }}
                >
                  Say Good - Bye to Empty Rooms - Get WELRM and Fill Your Hotel Today!
                </Typography>
              </Grid>
            )}

            {/* Navigation Section */}
            <Grid item>
              {isMobile ? (
                <IconButton color="inherit" onClick={toggleDrawer(true)}>
                  <MenuIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                  <Button onClick={onAboutClick} sx={{ color: 'black', marginRight: '0px',borderRight:'2px solid ',borderRadius:0,paddingY:"0px"}}><b>About Us</b></Button>
                  <Button sx={{ color: 'black', marginRight: '16px' }}><b>FAQ,s</b></Button>
                  <Link to="/loginReg" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <IconButton color="error">
                    <img
                      src={lo}
                      alt="Login Icon"
                      style={{ width: 30, height: 30, marginRight: '8px' }}
                    />
                    <Typography variant="button" sx={{ marginLeft: '5px' }}>
                      Login/Register
                    </Typography>
                  </IconButton>
                  </Link>
                </Box>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Navigation */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, padding: 2 }}>
          <IconButton onClick={toggleDrawer(false)} sx={{ mb: 2 }}>
            <CloseIcon />
          </IconButton>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="About Us" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="FAQ's" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <Link to="/loginReg" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <IconButton color="error" sx={{ padding: 0 }}>
                  <img
                    src={lo}
                    alt="Login Icon"
                    style={{ width: 30, height: 30, marginRight: '8px' }}
                  />
                  <Typography variant="button" sx={{ marginLeft: '5px', color: 'inherit' }}>
                    Login/Register
                  </Typography>
                </IconButton>
              </Link>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Header;
