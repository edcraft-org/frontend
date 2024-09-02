import { Box, Grid, Button, TextField } from "@mui/material";
import NavBar from "../../../components/NavBar/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<string[]>(["CS1101S", "CS2030S", "CS2040S", "CS2109S"]);
  const [newProject, setNewProject] = useState<string>("");
  const navigate = useNavigate();

  const addProject = () => {
    if (newProject.trim() !== "" && !projects.includes(newProject)) {
      setProjects([...projects, newProject]);
      setNewProject("");
    } else {
      alert("Project already exists or input is empty.");
    }
  };

  const handleProjectClick = (project: string) => {
    navigate(`/projects/${project}/assessments`);
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
                {project}
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