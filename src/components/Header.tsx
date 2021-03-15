import React from 'react';
import { Menu, Layout} from 'antd';
import '../styles/Header.less';
import { Link } from 'react-router-dom';

export const Header = () => (
	<Layout.Header className="app-header">
		<h1>
			My app
		</h1>
		
	</Layout.Header>
);