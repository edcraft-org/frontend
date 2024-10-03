import { Box, Grid, Button, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../../components/NavBar/Navbar";
import { getUserProjects, createProject, Project } from "../../../utils/api/ProjectAPI";
import { AuthContext } from "../../../context/Authcontext";

export const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<string>("");
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
      setProjects([...projects, {...newProjectData, _id: createdProject._id}]);
      setNewProject("");
    } else {
      alert("Project already exists or input is empty.");
    }
  };

  const handleProjectClick = (project: Project) => {
    console.log(project);
    navigate(`/projects/${project._id}/assessments`, {
      state: { projectTitle: project.title },
    });
  };

  return (
    <Box sx={{ width: '100%'}}>
      <NavBar/>
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
                  cursor: 'pointer',
                }}
                onClick={() => handleProjectClick(project)}
              >
                {project.title}
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
    </Box>
  );
};

export default ProjectPage;