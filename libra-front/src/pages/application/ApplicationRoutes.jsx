import { useRoutes } from 'react-router-dom';

import { ErrorBoundaryPage } from '../../components/errorBoundary';

import { routes } from './routes';

export const ApplicationRoutes = () => {
  const element = useRoutes(routes);
  return <ErrorBoundaryPage>{element}</ErrorBoundaryPage>;
};
