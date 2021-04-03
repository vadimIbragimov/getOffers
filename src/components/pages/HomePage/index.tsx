import Layout, { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import { Classificator } from "./Classificator";
import { Groups } from "./Groups";
import { PostsTable } from "./PostsTable";
import { ClassificatorType, ParsedGroupType } from "./types";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import useBreakpoint from 'use-breakpoint';
import { BrandTooltip } from './BrandTooltip';


import './style/index.less';
import { BREAKPOINTS, serverAddress } from "../../../constants";
import { Button, Drawer } from "antd";

const Homepage = () => {

	const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');

	const [loading, setLoading] = useState<boolean>(false);
	const [classificator, setClassificator] = useState<ClassificatorType>([]);
	const [groups, setGroups] = useState<string[]>([]);
	const [postsData, setPostsData] = useState<ParsedGroupType[]>([]);

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
				// console.log('[onLoadDataClick]: resData',resData);
				setPostsData(resData);
			});
	};

	const [visible, setVisible] = useState<boolean>(false);

	return (
		<div className="container">
			{/* {console.log('breakpoints', breakpoint)} */}
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