import React from 'react';
import { useLoader } from '../Reducers/LoaderProvider';
import CircularProgress from '@mui/material/CircularProgress';

const GlobalLoader = () => {
  const { loading } = useLoader();

  // Log to confirm loading state

  return (
    <>
      {loading && (
        <div style={loaderContainerStyles}>
          <div style={loaderBackdropStyles} />
          <CircularProgress sx={spinnerStyles} />
        </div>
      )}
    </>
  );
};

const loaderContainerStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999, // Set a high z-index to make sure it shows above everything
};

const loaderBackdropStyles = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  animation: 'fade 1s infinite alternate',
};

const spinnerStyles = {
  color: '#ffffff',
  zIndex: 10000,
  animation: 'rotate 1.2s linear infinite',
};

const styles = document.createElement('style');
styles.innerHTML = `
@keyframes fade {
  0% { opacity: 0.5; }
  100% { opacity: 0.8; }
}
@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styles);

export default GlobalLoader;
