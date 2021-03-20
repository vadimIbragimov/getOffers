import React from 'react';
import { Menu, Layout } from 'antd';
import './index.less';
import { Link } from 'react-router-dom';

const logo = require('./Logo.png');
console.log(logo);

export const Header = () => (
	<Layout.Header className="app-header">
		<article>
			<Link className="home-link" to="/">
				<img className="logo-header" src={logo?.default} alt="logo" />
			</Link>
		</article>
	</Layout.Header>
);