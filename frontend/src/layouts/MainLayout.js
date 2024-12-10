import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MainLayout({ children }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 检查是否有token来判断登录状态
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/home')}
          >
            风渡
          </Typography>
          <Button color="inherit" onClick={() => navigate('/home')}>首页</Button>
          <Button color="inherit" onClick={() => navigate('/forum')}>论坛</Button>
          
          {isLoggedIn ? (
            <>
              <Button color="inherit" onClick={() => navigate('/profile')}>个人资料</Button>
              <Button color="inherit" onClick={handleLogout}>退出</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>登录</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>注册</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}

export default MainLayout;