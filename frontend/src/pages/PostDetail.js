import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
  Avatar,
  Paper,
  TextField,
  Button
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import MainLayout from '../layouts/MainLayout';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // 新增:记录当前正在回复的评论

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('获取帖子失败');
      const data = await response.json();
      setPost(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${id}/comments`);
      if (!response.ok) throw new Error('获取评论失败');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      setError('获取评论失败');
    }
  };

  const handleLike = async () => {
    try {
      // 立即更新UI
      const newIsLiked = !post.is_liked;
      const newLikesCount = post.likes_count + (newIsLiked ? 1 : -1);
      
      setPost(prev => ({
        ...prev,
        is_liked: newIsLiked,
        likes_count: newLikesCount
      }));

      // 发送请求到后端
      const response = await fetch(`http://localhost:8000/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        // 如果请求失败,回滚UI状态
        setPost(prev => ({
          ...prev,
          is_liked: !newIsLiked,
          likes_count: prev.likes_count + (newIsLiked ? -1 : 1)
        }));
        throw new Error('点赞失败');
      }
    } catch (error) {
      setError('点赞失败');
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);  
    setNewComment('');
  };

  const handleComment = async (parentId = null) => {
    if (!newComment.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newComment,
          parent_id: parentId,
          reply_to: replyingTo?.reply_to || null
        })
      });

      if (response.ok) {
        setNewComment('');
        setReplyingTo(null); // 重置回复状态
        fetchComments();
      }
    } catch (error) {
      setError('发表评论失败');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ 
        maxWidth: '100%',
        width: '1200px',
        margin: '0 auto',
        p: 3,  // 增加内边距
        display: 'flex',
        flexDirection: 'column',
        gap: 3,  // 增加组件间距
      }}>
        {isLoading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {post && (
          <Card
            elevation={3}  // 增加阴影
            sx={{
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <CardContent sx={{ p: 4 }}>  {/* 增加内容内边距 */}
              <Typography 
                variant="h4"   // 增大标题字号
                gutterBottom 
                sx={{ 
                  fontWeight: 500,
                  color: 'primary.main' 
                }}
              >
                {post.title}
              </Typography>
              <Typography 
                variant="body1" 
                component="pre"
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  mb: 2,
                  lineHeight: 1.8,
                  fontFamily: 'inherit'
                }}
              >
                {post.content}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    onClick={handleLike}
                    color={post.is_liked ? "primary" : "default"}
                  >
                    {post.is_liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  </IconButton>
                  <Typography variant="caption">{post.likes_count} 赞</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption">作者: {post.author}</Typography>
                  <Typography variant="caption">
                    {new Date(post.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Comments section */}
        <Paper 
          elevation={2}
          sx={{ 
            width: '95%',        // 评论区略窄
            alignSelf: 'center', // 居中对齐
            borderRadius: 2,     // 圆角
            p: 3,               // 更大的内边距
            bgcolor: 'background.paper',
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              fontWeight: 500,
              color: 'primary.main',
              mb: 3
            }}
          >
            评论
          </Typography>
          
          {/* Main comment input */}
          {!replyingTo && (
            <Box 
              sx={{ 
                mb: 4,  // 增加底部间距
                position: 'sticky',
                top: 0,
                bgcolor: 'background.paper',
                zIndex: 1,
                pt: 1,
                pb: 2,
                borderBottom: 1,  // 添加底部边框
                borderColor: 'divider'
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="写下你的评论..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button 
                variant="contained" 
                sx={{ mt: 1 }}
                onClick={() => handleComment(null)}
              >
                发表评论
              </Button>
            </Box>
          )}

          {/* Comments list */}
          <Box sx={{ pl: 2 }}>  {/* 为评论列表添加左边距 */}
            {comments.map((comment) => (
              <Box 
                key={comment.id} 
                sx={{ 
                  mb: 3,  // 增加评论间距
                  pb: 2,  // 增加底部内边距
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottom: 0
                  }
                }}
              >
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Avatar sx={{ mr: 2 }}>{comment.author[0]}</Avatar>
                  <Box sx={{ width: '100%', wordBreak: 'break-word' }}>
                    <Typography variant="subtitle2">{comment.author}</Typography>
                    <Typography 
                      variant="body2" 
                      component="pre"
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        my: 1,
                        lineHeight: 1.6,
                        fontFamily: 'inherit',
                        width: '100%',      // 确保宽度100%
                        height: 'auto',     // 自动高度
                        overflowWrap: 'break-word'  // 添加自动换行
                      }}
                    >
                      {comment.content}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                      <Typography variant="caption">
                        {new Date(comment.created_at).toLocaleString()}
                      </Typography>
                      <Button 
                        size="small"
                        onClick={() => setReplyingTo(comment)}
                      >
                        回复
                      </Button>
                    </Box>

                    {/* Reply input */}
                    {replyingTo?.id === comment.id && (
                      <Box sx={{ mt: 2, ml: -2 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder={`回复 ${comment.author}...`}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          size="small"
                        />
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => handleComment(comment.id)}
                          >
                            发表回复
                          </Button>
                          <Button 
                            size="small"
                            onClick={handleCancelReply}
                          >
                            取消
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {/* Replies list */}
                    {comment.replies && comment.replies.length > 0 && (
                      <Box sx={{ 
                        ml: 4,  // 增加缩进
                        mt: 2,
                        pl: 2,
                        borderLeft: 2,  // 添加左侧边框
                        borderColor: 'primary.light'
                      }}>
                        {comment.replies.map(reply => (
                          <Box key={reply.id} sx={{ display: 'flex', mb: 2 }}>
                            <Avatar sx={{ mr: 2, width: 24, height: 24 }}>
                              {reply.author[0]}
                            </Avatar>
                            <Box sx={{ width: '100%' }}>
                              <Typography variant="subtitle2">
                                {reply.author}
                                {reply.reply_to && (
                                  <Typography 
                                    component="span" 
                                    color="text.secondary"
                                    sx={{ ml: 1 }}
                                  >
                                    回复 {reply.reply_to}
                                  </Typography>
                                )}
                              </Typography>
                              <Typography 
                                variant="body2"
                                component="pre"
                                sx={{ 
                                  whiteSpace: 'pre-wrap',
                                  my: 0.5,
                                  lineHeight: 1.6,
                                  fontFamily: 'inherit',
                                  width: '100%',
                                  height: 'auto',
                                  overflowWrap: 'break-word'
                                }}
                              >
                                {reply.content}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Typography variant="caption">
                                  {new Date(reply.created_at).toLocaleString()}
                                </Typography>
                                <Button 
                                  size="small"
                                  onClick={() => setReplyingTo({
                                    ...comment,
                                    reply_to: reply.author
                                  })}
                                >
                                  回复
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
}

export default PostDetail;
