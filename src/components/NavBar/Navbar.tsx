import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import questionsImage from '../../assets/question.png';
import { AuthContext } from '../../context/Authcontext';

interface NavBarProps {
  projectId?: string;
  isProjectAssessment?: boolean;
  isProjectQuestionBank?: boolean;
  isQuestionCreation?: boolean;
  assessment?: {
    id: string;
    title: string;
  }
  questionBank?: {
    id: string;
    title: string;
  }
}

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function NavBar({ projectId, assessment, questionBank, isProjectAssessment, isProjectQuestionBank, isQuestionCreation }: NavBarProps) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const breadcrumbs = [
    <Link key="1" color="inherit" onClick={() => navigate('/')}>
      Projects
    </Link>,
  ];

  if (projectId) {
    if (isProjectAssessment || (assessment && assessment.id && assessment.title)) {
      breadcrumbs.push(
        <Link key="2" color="inherit" onClick={() => navigate(`/projects/${projectId}/assessments`)}>
          {projectId} Assessments
        </Link>
      );
    }
    if (isProjectQuestionBank || (questionBank && questionBank.id && questionBank.title)) {
      breadcrumbs.push(
        <Link key="3" color="inherit" onClick={() => navigate(`/projects/${projectId}/questionBanks`)}>
          {projectId} Question Banks
        </Link>
      );
    }
  }

  if (assessment && assessment.id && assessment.title) {
    breadcrumbs.push(
      <Link key="3" color="inherit" onClick={() => navigate(`/projects/${projectId}/assessments/${assessment.id}`)}>
        {assessment.title}
      </Link>
    );
  }

  if (questionBank && questionBank.id && questionBank.title) {
    breadcrumbs.push(
      <Link key="4" color="inherit" onClick={() => navigate(`/projects/${projectId}/questionBanks/${questionBank.id}`)}>
        {questionBank.title}
      </Link>
    );
  }

  if (isQuestionCreation) {
    breadcrumbs.push(
      <Link key="5" color="inherit" onClick={() => navigate(`/projects/${projectId}/createQuestion`)}>
        Create Question
      </Link>
    );
  }

  // Replace the last breadcrumb with Typography
  if (breadcrumbs.length > 0) {
    const lastBreadcrumb = breadcrumbs.pop();
    breadcrumbs.push(
      <Typography key="last" sx={{ color: 'text.primary' }}>
        {lastBreadcrumb?.props.children}
      </Typography>
    );
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
              display: { xs: 'flex', md: 'flex' },
              marginRight: '1rem',
              width: { xs: '25px', md: '40px' },
              height: { xs: '25px', md: '40px' }
            }}
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'flex' },
            flexGrow: { xs: 1, md: 0 },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: '#ff3908',
            textDecoration: 'none',
            fontSize: ['1.25rem', '1.25rem', '1.5rem', '1.5rem'],
          }}
        >
          EdCraft
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Box>

        {user ? (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                  {user.name[0]}
                </Avatar>
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
        ) : (
          <></>
        )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;