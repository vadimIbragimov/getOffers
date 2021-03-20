import React from 'react';
import { Menu, Layout} from 'antd';
import '../styles/Header.less';
import { Link } from 'react-router-dom';
import logo from '../assets/images/Logo.png'
export const Header = () => (
	<Layout.Header className="app-header">
		
		<h1>
			<a href="#">
				<img className="logo-header" src={process.env.PUBLIC_URL + '../assets/images/Logo.png:'} alt="logo"/>
			</a>
		</h1>
		
	</Layout.Header>
);