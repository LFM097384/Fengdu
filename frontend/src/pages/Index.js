import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ForumIcon from '@mui/icons-material/Forum';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

function Index() {
  const navigate = useNavigate();

  const scrollToNext = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box>
      {/* 第一屏：主标题 */}
      <Box
        id="section1"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'url("/images/BackgroundMain.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backgroundBlend: 'overlay'
        }}
      >
        <Typography variant="h1" sx={{ color: '#fff', mb: 4, textAlign: 'center' }}>
          风渡
        </Typography>
        <Typography variant="h4" sx={{ color: '#fff', mb: 6, textAlign: 'center' }}>
          风渡云起，献给时代的海外学生论坛
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/register')}
            sx={{ mr: 2 }}
          >
            立即注册
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/login')}
            sx={{ color: '#fff', borderColor: '#fff' }}
          >
            登录
          </Button>
        </Box>
        <IconButton 
          onClick={() => scrollToNext('section2')}
          sx={{ color: '#fff', animation: 'bounce 2s infinite' }}
        >
          <KeyboardArrowDownIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* 第二屏：功能介绍 */}
      <Box
        id="section2"
        sx={{
          minHeight: '100vh',
          py: 8,
          bgcolor: 'background.default'
        }}
      >
        <Container>
          <Typography variant="h3" sx={{ mb: 6, textAlign: 'center' }}>
            为什么选择风渡？
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ForumIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h5" gutterBottom>
                    沟通交流
                  </Typography>
                  <Typography>
                    发帖提问、回答问题，与同在海外的学子分享生活
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <GroupIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h5" gutterBottom>
                    私人群组
                  </Typography>
                  <Typography>
                    与志同道合的朋友构成群组，共享活动，心梦相通
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h5" gutterBottom>
                    学海无涯
                  </Typography>
                  <Typography>
                    分享学术经验，找到最新的方法和最好的研究机会。
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SportsEsportsIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h5" gutterBottom>
                    娱乐天地
                  </Typography>
                  <Typography>
                    组局打游戏、观影、运动，在异国他乡找到快乐的小伙伴
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <MenuBookIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h5" gutterBottom>
                    读书共享
                  </Typography>
                  <Typography>
                    畅聊文学、分享感悟，在书香中找到知己，共享成长时光
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PeopleAltIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h5" gutterBottom>
                    知己相遇
                  </Typography>
                  <Typography>
                    深度社交匹配，找到志趣相投的朋友，让留学生活更有温度
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
        <IconButton 
          onClick={() => scrollToNext('section3')}
          sx={{ 
            display: 'block',
            margin: '0 auto',
            mt: 4,
            color: 'primary.main',
            animation: 'bounce 2s infinite'
          }}
        >
          <KeyboardArrowDownIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* 第三屏：数据统计 */}
      <Box
        id="section3"
        sx={{
          minHeight: '100vh',
          py: 8,
          backgroundImage: 'linear-gradient(rgba(74,123,80,0.9), rgba(135,206,235,0.9))'
        }}
      >
        <Container>
          <Typography variant="h3" sx={{ mb: 6, textAlign: 'center', color: '#fff' }}>
            社区数据
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h2" sx={{ textAlign: 'center', color: '#fff' }}>
                000+
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', color: '#fff' }}>
                活跃用户
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h2" sx={{ textAlign: 'center', color: '#fff' }}>
                000+
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', color: '#fff' }}>
                知识帖子
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h2" sx={{ textAlign: 'center', color: '#fff' }}>
                0000+
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', color: '#fff' }}>
                问题解答
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: '#fff', 
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              加入我们
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Index;