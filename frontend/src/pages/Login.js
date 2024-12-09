import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography,
  Link,
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formBody = new URLSearchParams();
      formBody.append('username', formData.username);
      formBody.append('password', formData.password);
      
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', data.username);
        navigate('/home');
      } else {
        alert('登录失败，请检查用户名和密码');
      }
    } catch (error) {
      console.error('登录错误:', error);
      alert('登录过程中发生错误');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/images/BackgroundAuth.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom align="center">
              登录
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="用户名"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="密码"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 3, mb: 2 }}
              >
                登录
              </Button>
              <Typography align="center">
                还没有账号？ 
                <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer' }}>
                  立即注册
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Login;