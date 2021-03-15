import { Spin } from 'antd';
import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import paths from '../utils/paths';

const Router = () => (
	<Switch>
		{paths.map((path, i) => (
			<Route key={i}  {...path} />
		))}
	</Switch>
);

export default Router;
