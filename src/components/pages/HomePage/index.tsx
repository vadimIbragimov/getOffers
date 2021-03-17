import Layout, { Content } from "antd/lib/layout/layout";
import React, { useState } from "react";
import { Button, Drawer, message } from "antd";
import Sider from "antd/lib/layout/Sider";
import useBreakpoint from 'use-breakpoint';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';


import { Groups } from "./Groups";
import { PostsTable } from "./PostsTable";
import { BrandTooltip } from './BrandTooltip';
import { Classificator } from "./Classificator";
import { ClassificatorType, ParsedGroupType } from "./types";
import { BREAKPOINTS, serverAddress } from "../../../constants";
import './style/index.less';

const Homepage = () => {

	const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');

	const [loading, setLoading] = useState<boolean>(false);
	const [classificator, setClassificator] = useState<ClassificatorType>([]);
	const [groups, setGroups] = useState<string[]>([]);
	const [postsData, setPostsData] = useState<ParsedGroupType[]>([]);

	const [visible, setVisible] = useState<boolean>(false);

	const onLoadDataClick = () => {
		setLoading(true)
		fetch(`${serverAddress}api/get_data`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				groups: groups,
				items: classificator
			})
		})
			.then((response) => response.json())
			.then((data) => {
				setLoading(false);
				const resData: ParsedGroupType[] = data;
				if(resData.length)				setPostsData(resData);
				else message.warn({
					content: 'По вашему запросу ничего не найдено',
					duration: 5
				})
			})
			.catch((e) => message.error({
        content: `Ошибка ${e.message}`,
        duration: 5
      }))
	};

	return (
		<div className="container">
			{console.log('breakpoints', breakpoint)}
			<Layout className="layout">
				{
					breakpoint !== 'mobile'
						? <Sider theme="light">
							<Classificator className="classificator_desctop" onChange={(classificator) => setClassificator(classificator)} />
						</Sider>
						: <>
							<Button className="open_drower_button" onClick={() => setVisible(!visible)}>
								{
									visible
										? <MenuFoldOutlined className="open_drower_button_icon" />
										: <MenuUnfoldOutlined className="open_drower_button_icon" />
								}
							</Button>
							<Drawer
								className="drawer"
								placement={'left'}
								closable={false}
								onClose={() => setVisible(false)}
								visible={visible}
							>
								<Classificator onChange={(classificator) => setClassificator(classificator)} />
							</Drawer>
							{
								breakpoint === 'mobile' && classificator.length === 0
									? <BrandTooltip />
									: null
							}
						</>
				}

				<Content className="content">
					<Groups onChange={(groups) => setGroups(groups)} />
					<div className="btn">
						<Button
							disabled={classificator.length === 0 || groups.length === 0 || loading}
							onClick={onLoadDataClick}
							type="primary"
							className="load_data_button"
						>	Отправить	</Button>
					</div>

					{
						postsData.length > 0
							? <PostsTable postsData={postsData} loading={loading} />
							: null
					}

				</Content>
			</Layout>
		</div>
	);
};

export default Homepage;