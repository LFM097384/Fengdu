import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';

function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: 获取帖子列表
    fetchPosts();
  }, []);

  const fetchPosts = async (searchTerm = '') => {
    try {
      setIsLoading(true);
      const endpoint = searchTerm 
        ? `http://localhost:8000/api/posts/search?query=${encodeURIComponent(searchTerm)}`
        : 'http://localhost:8000/api/posts';
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('获取帖子失败');
      }
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('获取帖子失败:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPosts(searchQuery);
  };

  const handleCreatePost = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newPost)
      });
      if (response.ok) {
        setOpen(false);
        fetchPosts();
        setNewPost({ title: '', content: '' });
      }
    } catch (error) {
      console.error('发布帖子失败:', error);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <MainLayout>
      <Box sx={{ 
        maxWidth: '100%',      // 改为100%
        width: '1200px',       // 设置固定宽度
        margin: '0 auto', 
        p: 2,
        '& .MuiCard-root': {   // 统一设置所有Card组件的宽度
          width: '100%',
          boxSizing: 'border-box'
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="搜索帖子..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton onClick={handleSearch}><SearchIcon /></IconButton>
          </Box>
          <Button variant="contained" onClick={() => setOpen(true)}>
            发布新帖
          </Button>
        </Box>

        {isLoading && (
          <Typography>加载中...</Typography>
        )}

        {error && (
          <Typography color="error">Error: {error}</Typography>
        )}

        {!isLoading && !error && (
          <List>
            {Array.isArray(posts) && posts.map((post) => (
              <React.Fragment key={post.id}>
                <ListItem sx={{ width: '100%', p: 1 }}> // 调整ListItem的宽度和padding
                  <Card 
                    sx={{ width: '100%', cursor: 'pointer' }}
                    onClick={() => handlePostClick(post.id)}
                  >
                    <CardContent>
                      <Typography variant="h6">{post.title}</Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          maxHeight: '100px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {post.content}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">
                          作者: {post.author}
                        </Typography>
                        <Typography variant="caption">
                          {new Date(post.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>发布新帖子</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="标题"
              margin="normal"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            />
            <TextField
              fullWidth
              label="内容"
              multiline
              rows={4}
              margin="normal"
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={handleCreatePost}>发布</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}

export default ForumPage;