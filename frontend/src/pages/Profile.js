import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Container,
  Box,
  Button,
  Fade,
  Grow,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import MainLayout from '../layouts/MainLayout';

// 更新API基础URL配置
const API_BASE_URL = 'http://localhost:8000';

function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    experience: 0,
    level: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''  // 确保加上Bearer前缀
    };
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('请先登录');
      }
      
      console.log('使用token:', token);  // 调试日志
      
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors'
      });

      console.log('响应:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `请求失败: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile Data:', data);
      setProfile(data);
    } catch (err) {
      console.error('获取资料失败:', err);
      if (err.message === '请先登录') {
        window.location.href = '/login';  // 重定向到登录页
      }
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const expNeeded = profile.level * 100;
    return (profile.experience % expNeeded) / expNeeded * 100;
  };

  const handleGetExp = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/add-experience/10`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '获取经验失败');
      }

      await fetchProfile();
      setSnackbar({
        open: true,
        message: '获取经验成功！',
        severity: 'success'
      });
    } catch (err) {
      console.error('Add exp error:', err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'  
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: 'url("/images/BackgroundAuth.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <MainLayout>
          <Container sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
            <CircularProgress />
          </Container>
        </MainLayout>
      </Box>
    );
  }

  const expNeeded = profile.level * 100;
  const currentLevelExp = profile.experience % expNeeded;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/images/BackgroundAuth.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <MainLayout>
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: 4, 
            mb: 4,
            display: 'flex',
            justifyContent: 'flex-start',  // 左对齐
            alignItems: 'flex-start'       // 顶部对齐
          }}
        >
          <Fade in timeout={1000}>
            <Card 
              sx={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
                width: '400px',  // 固定卡片宽度
                alignSelf: 'flex-start'  // 确保卡片在容器顶部
              }}
            >
              <CardContent sx={{ p: 4 }}> {/* 增加内边距 */}
                <Typography variant="h5" component="h1" gutterBottom align="center">
                  个人资料
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                  )}
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom align="center">
                    基本信息
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
                    用户名: {profile.username}
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    邮箱: {profile.email}
                  </Typography>
                </Box>
                <Grow in timeout={1500}>
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom align="center">
                      等级信息
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Tooltip title={`总经验值: ${profile.experience}`} arrow>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StarIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="h6">
                            等级 {profile.level}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                      当前等级经验: {currentLevelExp} / {expNeeded}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgress()}
                      sx={{ 
                        height: 10,
                        borderRadius: 5,
                        mb: 3,
                        '& .MuiLinearProgress-bar': {
                          transition: 'transform 0.8s ease'
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={handleGetExp}
                        sx={{ minWidth: 200 }}
                      >
                        获取经验
                      </Button>
                    </Box>
                  </Box>
                </Grow>
              </CardContent>
            </Card>
          </Fade>
        </Container>
      </MainLayout>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;