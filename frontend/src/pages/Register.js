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

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致！');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', data.username);
        navigate('/home');
      } else {
        const errorData = await response.json();
        alert(errorData.detail || '注册失败');
      }
    } catch (error) {
      console.error('注册错误:', error);
      alert('注册过程中发生错误');
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
              注册
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
                label="邮箱"
                name="email"
                type="email"
                value={formData.email}
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
              <TextField
                fullWidth
                margin="normal"
                label="确认密码"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
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
                注册
              </Button>
              <Typography align="center">
                已有账号？
                <Link onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
                  返回登录
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Register;