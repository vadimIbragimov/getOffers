import React from 'react';
import { Menu, Layout } from 'antd';
import './index.less';
import { Link } from 'react-router-dom';
import Icon from '@ant-design/icons';
import { ReactComponent as vkLogo } from './vk-1.svg';
import { YMInitializer } from 'react-yandex-metrika'
// import ym from 'react-yandex-metrika';

const logo = require('./Logo.png');
function ym() {
    return (
      "<!-- Yandex.Metrika counter -->\
	  <script type='text/javascript' >\
	  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};\
   		m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})\
		   (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');\
		   try {\
		   ym(75105355, 'init', {\
			clickmap:true,\
			trackLinks:true,\
			accurateTrackBounce:true,\
			webvisor:true\
		   } catch(e) { }\
	   });\
      </script>\
	  <noscript><div><img src='https://mc.yandex.ru/watch/75105355' style='position:absolute; left:-9999px;' alt='' /></div></noscript>\
	  <!-- /Yandex.Metrika counter -->\
	  "
    );
  }
export const Header = () => (
	<Layout.Header className="app-header">
		<article>
		<div dangerouslySetInnerHTML={{__html: ym()}}/>
		


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