import React from 'react';
import { RouteProps } from 'react-router-dom';

const Homepage = React.lazy(() => import('../components/pages/HomePage'));
const Page404 = React.lazy(() => import('../components/pages/Page404'));

type PageType = { name?: string } & RouteProps;

const paths: PageType[] = [
   {
      exact: true,
      path: '/',
      component: Homepage,
   },
   {
      exact: true,
      path: '*',
      component: Page404,
   },
];

export default paths;