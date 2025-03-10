import type React from "react"

import {
  Box,
  Grid,
  Button,
  TextField,
  IconButton,
  Typography,
  Paper,
  Container,
  Fade,
  Grow,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import FolderIcon from "@mui/icons-material/Folder"
import SearchIcon from "@mui/icons-material/Search"

import NavBar from "../../../components/NavBar/Navbar"
import {
  getUserProjects,
  createProject,
  deleteProject,
  renameProjectTitle,
  type Project,
} from "../../../utils/api/ProjectAPI"
import { AuthContext } from "../../../context/Authcontext"
import EditDialog from "../../../components/Dialogs/EditDialog/EditDialog"
import DeleteDialog from "../../../components/Dialogs/DeleteDialog/DeleteDialog"

export const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState<string>("")
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [editTitle, setEditTitle] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        const userProjects = await getUserProjects(user.id)
        setProjects(userProjects)
        setFilteredProjects(userProjects)
      }
    }
    fetchProjects()
  }, [user])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter((project) => project.title.toLowerCase().includes(searchTerm.toLowerCase())))
    }
  }, [searchTerm, projects])

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Error: User authentication required
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Container>
    )
  }

  const addProject = async () => {
    if (newProject.trim() !== "" && !projects.some((project) => project.title === newProject.trim())) {
      const newProjectData = {
        title: newProject,
        user_id: user.id,
      }
      const createdProject = await createProject(newProjectData)
      setProjects([...projects, { ...newProjectData, _id: createdProject._id }])
      setNewProject("")
      setIsAddingNew(false)
    } else {
      alert("Project already exists or input is empty.")
    }
  }

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project._id}/assessments`, {
      state: { projectTitle: project.title },
    })
  }

  const handleEditClick = (project: Project, event: React.MouseEvent) => {
    event.stopPropagation()
    setEditProject(project)
    setEditTitle(project.title)
    setDialogOpen(true)
  }

  const handleDeleteClick = (project: Project, event: React.MouseEvent) => {
    event.stopPropagation()
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete._id)
      setProjects(projects.filter((project) => project._id !== projectToDelete._id))
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  const handleEditSave = async () => {
    if (editProject && editTitle.trim() !== "") {
      const updatedProject = await renameProjectTitle(editProject._id, { title: editTitle })
      setProjects(projects.map((project) => (project._id === editProject._id ? updatedProject : project)))
      setDialogOpen(false)
      setEditProject(null)
      setEditTitle("")
    } else {
      alert("Title cannot be empty.")
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      addProject()
    }
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ pt: 10, pb: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
            My Projects
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage your projects and assessments in one place
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexDirection: isMobile ? "column" : "row" }}>
            <TextField
              placeholder="Search projects..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsAddingNew(true)}
              sx={{
                minWidth: isMobile ? "100%" : "200px",
                height: "56px",
                boxShadow: 2,
              }}
            >
              New Project
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {filteredProjects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={project._id || index}>
              <Grow in={true} timeout={(index + 1) * 200}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    height: "180px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                      "& .project-actions": {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => handleProjectClick(project)}
                >
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "primary.main",
                        height: "8px",
                        width: "100%",
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        flexGrow: 1,
                      }}
                    >
                      <FolderIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                      <Box sx={{ overflow: "hidden" }}>
                        <Typography
                          variant="h6"
                          fontWeight="medium"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {project.title}
                        </Typography>
                        {/* <Typography variant="body2" color="text.secondary">
                          Created: {new Date().toLocaleDateString()}
                        </Typography> */}
                      </Box>
                    </Box>

                    <Box
                      className="project-actions"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 1.5,
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
                        opacity: { xs: 1, md: 0 },
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      <Tooltip title="Edit project">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => handleEditClick(project, e)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete project">
                        <IconButton size="small" color="error" onClick={(e) => handleDeleteClick(project, e)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              </Grow>
            </Grid>
          ))}

          {isAddingNew && (
            <Grid item xs={12} sm={6} md={4}>
              <Fade in={true}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    height: "180px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    border: "2px dashed",
                    borderColor: "primary.light",
                    bgcolor: "rgba(25, 118, 210, 0.04)",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Create New Project
                  </Typography>
                  <TextField
                    autoFocus
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter project name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button onClick={addProject} variant="contained" fullWidth disabled={!newProject.trim()}>
                      Create
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingNew(false)
                        setNewProject("")
                      }}
                      variant="outlined"
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          )}

          {filteredProjects.length === 0 && !isAddingNew && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  {searchTerm ? "No projects match your search" : "You don't have any projects yet"}
                </Typography>
                {!searchTerm && (
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddingNew(true)}>
                    Create Your First Project
                  </Button>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      <EditDialog
        open={dialogOpen}
        title="Project"
        value={editTitle}
        onClose={() => setDialogOpen(false)}
        onSave={handleEditSave}
        onChange={(e) => setEditTitle(e.target.value)}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="project"
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
      />
    </Box>
  )
}

export default ProjectPage

