import React from 'react';
import { Menu, Layout } from 'antd';
import './index.less';
import { Link } from 'react-router-dom';
import Icon from '@ant-design/icons';
import { ReactComponent as vkLogo } from './vk-1.svg';

const logo = require('./Logo.png');

export const Header = () => (
	<Layout.Header className="app-header">
		<article>
			<Link className="home-link" to="/">
				<img className="logo-header" src={logo?.default} alt="logo" />
			</Link>
		</article>
		<article className="right-panel">
			<a href="https://vk.com/get.offers/" target="_blank" rel="noreferrer" className="vk-group-link">
				<Icon component={vkLogo} style={{ fontSize: '30px' }} />
			</a>
		</article>
	</Layout.Header>
);