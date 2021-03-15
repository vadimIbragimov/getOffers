import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const title = <article>
	Упс. Я хотел сделать эту страницу, но меня отговорили. <br />
	Если вы считаете что эта страница должна быть тут, напишите мне.<br />
	Или можно просто
</article>;

const Page404 = () => (
	<Result
		status="404"
		title="404"
		subTitle={title}
		extra={<Link to="/"><Button type="primary">Вернуться на главную</Button></Link>}
	/>
);

export default Page404;
