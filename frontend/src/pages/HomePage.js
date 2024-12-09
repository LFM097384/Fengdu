import React from 'react';
import { 
  Card, 
  CardContent,
  Typography,
  Button,
  Box,
  TextField
} from '@mui/material';
import MainLayout from '../layouts/MainLayout';

function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/images/BackgroundMain.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <MainLayout>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            placeholder="搜索帖子..."
            size="small"
            sx={{ 
              width: 300,
              '& .MuiInputBase-input': {
                color: '#fff'
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)'
                },
                '&:hover fieldset': {
                  borderColor: '#fff'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff'
                }
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255,255,255,0.7)',
                opacity: 1
              }
            }}
          />
          <Button 
            variant="contained"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            发布新帖子
          </Button>
        </Box>
        
        <Card 
          sx={{ 
            mb: 2,
            bgcolor: 'rgba(255,255,255,0.25)',
            color: '#fff'
          }}
        >
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ color: '#f5f5dc' }}
            >
              浪吞飞鸟千帆动，风渡游云一径横
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: '#f5f5dc' }}
            >
              Welcome to 风渡
            </Typography>
          </CardContent>
        </Card>
      </MainLayout>
    </Box>
  );
}

export default HomePage;