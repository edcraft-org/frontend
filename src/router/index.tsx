import { createBrowserRouter } from 'react-router-dom';
import CollectionPage from '../pages/CollectionPage/CollectionPage';
import CollectionDetailsPage from '../pages/CollectionDetailsPage/CollectionDetailsPage';

const routerOptions = {
  basename: '/edcraft'
};

const routes = [
  {
    path: '/',
    element: <CollectionPage />,
  },
  {
    path: '/collections/:collectionId',
    element: <CollectionDetailsPage />,
  }
];

export const router = createBrowserRouter(routes, routerOptions);