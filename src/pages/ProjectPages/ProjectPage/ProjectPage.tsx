import { Box, Grid, Button, TextField, IconButton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import NavBar from "../../../components/NavBar/Navbar";
import { getUserProjects, createProject, deleteProject, renameProjectTitle, Project } from "../../../utils/api/ProjectAPI";
import { AuthContext } from "../../../context/Authcontext";
import EditDialog from "../../../components/Dialogs/EditDialog/EditDialog";
import DeleteDialog from "../../../components/Dialogs/DeleteDialog/DeleteDialog";

export const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<string>("");
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        const userProjects = await getUserProjects(user.id);
        setProjects(userProjects);
      }
    };
    fetchProjects();
  }, [user]);

  if (!user) {
    return <div>Error: User is missing</div>;
  }

  const addProject = async () => {
    if (newProject.trim() !== "" && !projects.some(project => project.title === newProject.trim())) {
      const newProjectData = {
        title: newProject,
        user_id: user.id,
      };
      const createdProject = await createProject(newProjectData);
      setProjects([...projects, { ...newProjectData, _id: createdProject._id }]);
      setNewProject("");
    } else {
      alert("Project already exists or input is empty.");
    }
  };

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project._id}/assessments`, {
      state: { projectTitle: project.title },
    });
  };

  const handleEditClick = (project: Project) => {
    setEditProject(project);
    setEditTitle(project.title);
    setDialogOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete._id);
      setProjects(projects.filter(project => project._id !== projectToDelete._id));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleEditSave = async () => {
    if (editProject && editTitle.trim() !== "") {
      const updatedProject = await renameProjectTitle(editProject._id, { title: editTitle });
      setProjects(projects.map(project => project._id === editProject._id ? updatedProject : project));
      setDialogOpen(false);
      setEditProject(null);
      setEditTitle("");
    } else {
      alert("Title cannot be empty.");
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar />
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Grid container spacing={2} sx={{ margin: '0 auto', maxWidth: '1200px' }}>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
                onClick={() => handleProjectClick(project)}
              >
                <Box sx={{ cursor: 'pointer', flexGrow: 1 }}>
                  {project.title}
                </Box>
                <IconButton
                  sx={{ position: 'absolute', top: '8px', right: '40px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(project);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  sx={{ position: 'absolute', top: '8px', right: '8px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(project);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                border: '1px dashed #ccc',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '150px',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ width: '80%' }}>
                <TextField
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button onClick={addProject} variant="outlined" fullWidth>
                  Add New Project
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

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
  );
};

export default ProjectPage;