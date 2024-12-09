import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Index from './pages/Index';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A7B50',
      light: '#87CEEB',
      dark: '#1E4D6B'
    },
    background: {
      default: '#E8F5E9',
      paper: '#ffffff'
    },
    text: {
      primary: '#1E4D6B',
      secondary: '#4A7B50'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(74,123,80,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(74,123,80,0.15)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, rgba(74,123,80,0.9) 30%, rgba(135,206,235,0.9) 90%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 4px rgba(30,77,107,0.1)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '6px',
          '&.MuiButton-contained': {
            background: 'linear-gradient(45deg, #4A7B50 30%, #87CEEB 90%)',
            color: '#ffffff',
            '&:hover': {
              background: 'linear-gradient(45deg, #1E4D6B 30%, #4A7B50 90%)'
            }
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#4A7B50'
            },
            '&:hover fieldset': {
              borderColor: '#87CEEB'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1E4D6B'
            }
          }
        }
      }
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    allVariants: {
      color: '#1E4D6B'
    },
    h6: {
      fontWeight: 500,
      color: '#ffffff'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;