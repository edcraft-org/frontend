"use client"

import type React from "react"

import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import Container from "@mui/material/Container"
import Avatar from "@mui/material/Avatar"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import HelpIcon from "@mui/icons-material/Help"
import { AuthContext } from "../../context/Authcontext"
import { supabase } from "../../../supabaseClient"

interface NavBarProps {
  isProjectAssessment?: boolean
  isProjectQuestionBank?: boolean
  isQuestionCreation?: boolean
  isQuestionEdit?: boolean
  project?: {
    id: string
    title?: string
  }
  assessment?: {
    id: string
    title: string
  }
  questionBank?: {
    id: string
    title: string
  }
}

const settings = ["Logout"]

function NavBar({
  project,
  assessment,
  questionBank,
  isProjectAssessment,
  isProjectQuestionBank,
  isQuestionCreation,
  isQuestionEdit,
}: NavBarProps) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const breadcrumbs = [
    <Link key="1" color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
      Projects
    </Link>,
  ]

  if (project && project.id && project.title) {
    if (isProjectAssessment || (assessment && assessment.id && assessment.title)) {
      breadcrumbs.push(
        <Link
          key="2"
          color="inherit"
          onClick={() => navigate(`/projects/${project.id}/assessments`, { state: { projectTitle: project.title } })}
          sx={{ cursor: "pointer" }}
        >
          {project.title} Assessments
        </Link>,
      )
    }
    if (isProjectQuestionBank || (questionBank && questionBank.id && questionBank.title)) {
      breadcrumbs.push(
        <Link
          key="3"
          color="inherit"
          onClick={() => navigate(`/projects/${project.id}/questionBanks`, { state: { projectTitle: project.title } })}
          sx={{ cursor: "pointer" }}
        >
          {project.title} Question Banks
        </Link>,
      )
    }
  }

  if (assessment && assessment.id && assessment.title) {
    breadcrumbs.push(
      <Link
        key="4"
        color="inherit"
        onClick={() =>
          navigate(`/projects/${project?.id}/assessments/${assessment.id}`, { state: { projectTitle: project?.title } })
        }
        sx={{ cursor: "pointer" }}
      >
        {assessment.title}
      </Link>,
    )
  }

  if (questionBank && questionBank.id && questionBank.title) {
    breadcrumbs.push(
      <Link
        key="5"
        color="inherit"
        onClick={() =>
          navigate(`/projects/${project?.id}/questionBanks/${questionBank.id}`, {
            state: { projectTitle: project?.title },
          })
        }
        sx={{ cursor: "pointer" }}
      >
        {questionBank.title}
      </Link>,
    )
  }

  if (isQuestionCreation) {
    breadcrumbs.push(
      <Link
        key="6"
        color="inherit"
        onClick={() => navigate(`/projects/${project?.id}/createQuestion`, { state: { projectTitle: project?.title } })}
        sx={{ cursor: "pointer" }}
      >
        Create Question
      </Link>,
    )
  }

  if (isQuestionEdit) {
    breadcrumbs.push(
      <Link
        key="6"
        color="inherit"
        onClick={() => navigate(`/projects/${project?.id}/editQuestion`, { state: { projectTitle: project?.title } })}
        sx={{ cursor: "pointer" }}
      >
        Edit Question
      </Link>,
    )
  }

  // Replace the last breadcrumb with Typography
  if (breadcrumbs.length > 0) {
    const lastBreadcrumb = breadcrumbs.pop()
    breadcrumbs.push(
      <Typography key="last" sx={{ color: "text.primary" }}>
        {lastBreadcrumb?.props.children}
      </Typography>,
    )
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const handleLogoClick = () => {
    navigate("/")
  }

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              mr: 2,
            }}
            onClick={handleLogoClick}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: "36px", md: "42px" },
                height: { xs: "36px", md: "42px" },
                borderRadius: "8px",
                background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                boxShadow: "0 4px 8px rgba(25, 118, 210, 0.25)",
                mr: 1.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "white",
                  fontSize: { xs: "18px", md: "22px" },
                }}
              >
                E
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  color: "#333333",
                  textDecoration: "none",
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  lineHeight: 1,
                  mb: 0.2,
                }}
              >
                Ed<span style={{ color: "#1976d2" }}>Craft</span>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#666666",
                  fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Educational Assessment Platform
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, ml: 2 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" } }}>
              {breadcrumbs}
            </Breadcrumbs>
          </Box>
          <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
            <Tooltip title="Documentation">
              <Box
                component="a"
                href="https://edcraft-org.github.io/user-guide/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.15)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <HelpIcon sx={{ fontSize: "24px", color: "#1976d2", mr: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#1976d2",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Docs
                </Typography>
              </Box>
            </Tooltip>
          </Box>
          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#1976d2",
                      width: 40,
                      height: 40,
                      fontWeight: 600,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {user.name?.[0] || user.email.split("@")[0][0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={setting === "Logout" ? handleLogout : handleCloseUserMenu}>
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
  )
}

export default NavBar
