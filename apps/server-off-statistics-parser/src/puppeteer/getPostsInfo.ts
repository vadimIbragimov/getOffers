import { Browser } from "puppeteer";
import { groupsList } from "./resources/groups";
import { parsePage } from "./tools/parsePage";
import { ParsedGroupType } from "./types";

const getPostsInfo: (browser: Browser, currentBase: ParsedGroupType[]) => Promise<ParsedGroupType[]> = async (browser, currentBase) => {
	const result = [];
	const page = await browser.newPage();
	for (const group of groupsList) {
		await page.goto(`https://vk.com/${group.href}`);
		console.log(`[getPostsInfo] loop by groups: Сканируем группу "${group.name}"`);
		const oldData = currentBase
			.find((searchGroup) => searchGroup.name === group.name)
			?.data || [];
		const data = await parsePage(page, oldData.map((dataItem) => dataItem.postId));
		result.push({ name: group.name, data: [...data, ...oldData] })
		console.log(`[getPostsInfo] loop by groups: Сканирование группы "${group.name}" завершено`);
	}
	page.close();
	return result;
};

export default getPostsInfo;
