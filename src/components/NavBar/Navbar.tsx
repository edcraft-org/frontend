import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import questionsImage from '../../assets/question.png';

interface NavBarProps {
  projectId?: string;
  assessmentId?: string;
  questionBankId?: string;
}

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function NavBar({ projectId, assessmentId, questionBankId }: NavBarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const pages = ['Projects'];
  if (projectId) {
    pages.push(projectId);
  }
  if (assessmentId) {
    pages.push(assessmentId);
  }
  if (questionBankId) {
    pages.push(questionBankId);
  }

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (page: string) => {
    if (page === 'Projects') {
      navigate('/');
    } else if (page === projectId) {
      if (assessmentId) {
        navigate(`/projects/${projectId}/assessments`);
      } else if (questionBankId) {
        navigate(`/projects/${projectId}/questionBanks`);
      }
    } else if (page === assessmentId) {
      navigate(`/projects/${projectId}/assessments/${assessmentId}`);
    } else if (page === questionBankId) {
      navigate(`/projects/${projectId}/questionBanks/${questionBankId}`);
    }
    handleCloseNavMenu();
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#fafafa' }} >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box
            component="img"
            src={questionsImage}
            alt="EdCraft Logo"
            sx={{
              display: { xs: 'none', md: 'flex' },
              marginRight: '1rem',
              width: '40px',
              height: '40px'
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#ff3908',
              textDecoration: 'none',
            }}
          >
            EdCraft
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'black' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleNavigate(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            component="img"
            src={questionsImage}
            alt="EdCraft Logo"
            sx={{
              display: { xs: 'flex', md: 'none' },
              mr: 1,
              width: '25px',
              height: '25px'
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#ff3908',
              textDecoration: 'none',
            }}
          >
            EdCraft
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <Box key={page} sx={{ display: 'flex', alignItems: 'center' }}>
                {index > 0 && (
                  <span style={{ margin: '0 1px', color: 'grey' }}>{'>'}</span>
                )}
                <Button
                  onClick={() => handleNavigate(page)}
                  sx={{
                    my: 2,
                    color: 'black',
                    display: 'block',
                    textTransform: 'none',
                    fontFamily: 'Calibri',
                    fontWeight: index === pages.length - 1 ? 'bold' : 'normal',
                  }}
                >
                  {page}
                </Button>
              </Box>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;