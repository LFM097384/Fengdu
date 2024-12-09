
import React from 'react';
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
          <Button color="inherit" onClick={() => navigate('/login')}>登录</Button>
          <Button color="inherit">我的内容</Button>
          <Button color="inherit" onClick={() => navigate('/')}>退出</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}

export default MainLayout;