import '@mui/material/styles/styled';
import { createBrowserRouter } from 'react-router-dom';
import ProjectPage from '../pages/ProjectPages/ProjectPage/ProjectPage';
import AssessmentDetailsPage from '../pages/AssessmentPages/AssessmentDetailsPage/AssessmentDetailsPage';
import QuestionBankDetailsPage from '../pages/QuestionPages/QuestionBankDetailsPage/QuestionBankDetailsPage';
import AssessmentPage from '../pages/AssessmentPages/AssessmentPage/AssessmentPage';
import QuestionBankPage from '../pages/QuestionPages/QuestionBankPage/QuestionBankPage';
import QuestionCreationPage from '../pages/QuestionPages/QuestionCreationPage/QuestionCreationPage';
import QuestionEditPage from '../pages/QuestionPages/QuestionEditPage/QuestionEditPage';
// import QuestionGroupPage from '../pages/QuestionPages/QuestionGroupPage/QuestionGroupPage';

const routes = [
  {
    path: '/',
    element: <ProjectPage />,
  },
  {
    path: '/projects/:projectId/assessments',
    element: <AssessmentPage />,
  },
  {
    path: '/projects/:projectId/assessments/:assessmentId',
    element: <AssessmentDetailsPage />,
  },
  {
    path: '/projects/:projectId/questionBanks',
    element: <QuestionBankPage />,
  },
  {
    path: '/projects/:projectId/questionBanks/:questionBankId',
    element: <QuestionBankDetailsPage />,
  },
  // {
  //   path: '/projects/:projectId/assessment/:assessmentId/questionGroups/:questionGroupId',
  //   element: <QuestionGroupPage />,
  // }
  {
    path: '/projects/:projectId/createQuestion',
    element: <QuestionCreationPage />
  },
  {
    path: "/projects/:projectId/editQuestion" ,
    element: <QuestionEditPage />
  }
];

export const router = createBrowserRouter(routes);