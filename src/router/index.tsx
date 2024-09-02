import { createBrowserRouter } from 'react-router-dom';
import ProjectPage from '../pages/ProjectPages/ProjectPage/ProjectPage';
import AssessmentDetailsPage from '../pages/AssessmentPages/AssessmentDetailsPage/AssessmentDetailsPage';
import CreateAssessmentPage from '../pages/AssessmentPages/CreateAssessmentPage/CreateAssessmentPage';
import QuestionBankDetailsPage from '../pages/QuestionPages/QuestionBankDetailsPage/QuestionBankDetailsPage';
import AssessmentPage from '../pages/AssessmentPages/AssessmentPage/AssessmentPage';
import QuestionBankPage from '../pages/QuestionPages/QuestionBankPage/QuestionBankPage';
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
    path: '/projects/:projectId/createAssessment/:assessmentId',
    element: <CreateAssessmentPage />,
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
];

export const router = createBrowserRouter(routes);