// src/pages/ProjectDetailsPage/ProjectDetailsPage.tsx
import { Box, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";

import NavBar from "../../../components/NavBar/Navbar";
import AssessmentPage from "../../AssessmentPages/AssessmentPage/AssessmentPage";
import QuestionBankPage from "../../QuestionPages/QuestionBankPage/QuestionBankPage";

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [view, setView] = useState<'assessment' | 'questionBank'>('assessment');

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'assessment' | 'questionBank') => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar projectId={projectId} />
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="h4" gutterBottom>
            Project {projectId}
          </Typography>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view selection"
          >
            <ToggleButton value="assessment" aria-label="assessment">
              Assessment
            </ToggleButton>
            <ToggleButton value="questionBank" aria-label="question bank">
              Question Bank
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {view === 'assessment' ? (
          <AssessmentPage />
        ) : (
          <QuestionBankPage />
        )}
      </Box>
    </Box>
  );
};

export default ProjectDetailsPage;


// import { Box, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// import NavBar from "../../components/NavBar/Navbar";

// const ProjectDetailsPage: React.FC = () => {
//   const { projectId } = useParams<{ projectId: string }>();
//   const navigate = useNavigate();

//   if (!projectId) {
//     return <div>Error: Project ID is missing</div>;
//   }

//   const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'assessment' | 'questionBank') => {
//     if (newView !== null) {
//       if (newView === 'assessment') {
//         navigate(`/projects/${projectId}/assessments`);
//       } else if (newView === 'questionBank') {
//         navigate(`/projects/${projectId}/questionBanks`);
//       }
//     }
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <NavBar projectId={projectId} />
//       <Box sx={{ marginTop: '64px', padding: 2 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
//           <Typography variant="h4" gutterBottom>
//             Project {projectId}
//           </Typography>
//           <ToggleButtonGroup
//             value={null}
//             exclusive
//             onChange={handleViewChange}
//             aria-label="view selection"
//           >
//             <ToggleButton value="assessment" aria-label="assessment">
//               Assessment
//             </ToggleButton>
//             <ToggleButton value="questionBank" aria-label="question bank">
//               Question Bank
//             </ToggleButton>
//           </ToggleButtonGroup>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ProjectDetailsPage;