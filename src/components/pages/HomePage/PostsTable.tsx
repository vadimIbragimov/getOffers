import React, { useState } from "react";
import { Button, Collapse, Modal, Table } from "antd";
import { ParsedGroupType } from "./types";
import ReactHtmlParser from 'react-html-parser';

import './style/PostsTable.less';
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { Breakpoint } from "antd/lib/_util/responsiveObserve";
import useBreakpoint from "use-breakpoint";
import { BREAKPOINTS } from "../../../constants";
import { FileTextOutlined } from "@ant-design/icons";
import { Image } from 'antd';

const breakpointAntd: Breakpoint = 'lg';

type DataType = {
  key: string;
  groupName: string;
  text: string;
  price: string;
  date: number;
  href: string;
  hrefImg: string[];
}


const DisplayDate = (date: any) => {
  const dateObj = new Date(date);
  const dateString = dateObj.toLocaleString('ru-RU');
  // return `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/ ${dateObj.getDate()}_${dateObj.getHours()}:${dateObj.getMinutes()}`
  return dateString
}

const hrefToPost = (href: string) => <a href={href} target="_blank" rel="noreferrer">Ссылка</a>;


const hrefToPostImg = (hrefImg: Array<string>) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  return <>
    <Button onClick={() => setIsModalVisible(!isModalVisible)}>
      <FileTextOutlined />
      Показать
    </Button>
    <Modal
      title={false}
      visible={isModalVisible}
      footer={null}
      bodyStyle={{ backgroundColor: "transparent" }}
      onOk={() => setIsModalVisible(!isModalVisible)}
      onCancel={() => setIsModalVisible(!isModalVisible)}
    >
      {hrefImg.map((href) => <Image width={200} src={href} />)}
      {/* <Image
        width={200}
        src={hrefImg[0]}
      /> */}
    </Modal>
  </>
};

const textOfPost = (text: string) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');
  const textFromHTML = ReactHtmlParser(text);
  if (breakpoint !== 'mobile') {
    return <div className="textCeil">
      {
        textFromHTML.toString().length > 80
          ? <Collapse>
            <CollapsePanel header={`${textFromHTML.toString().slice(0, 80)}`} key="1">
              <p>{textFromHTML}</p>
            </CollapsePanel>
          </Collapse>
          : textFromHTML
      }
    </div>
  } else {
    return <>
      <Button onClick={() => setIsModalVisible(!isModalVisible)}>
        <FileTextOutlined />
        Показать
      </Button>
      <Modal
        title={false}
        visible={isModalVisible}
        onOk={() => setIsModalVisible(!isModalVisible)}
        onCancel={() => setIsModalVisible(!isModalVisible)}
      >
        {textFromHTML}
      </Modal>
    </>
  }

};


const columns = [
  {
    title: 'Название группы',
    dataIndex: 'groupName',
    key: 'groupName',
    sorter: (a: any, b: any) => {
      if (a.groupName > b.groupName) {
        return 1;
      }
      if (a.groupName < b.groupName) {
        return -1;
      }
      // a должно быть равным b
      return 0;
    },
  },
  {
    title: 'Текст поста',
    dataIndex: 'text',
    key: 'text',
    render: textOfPost,
  },
  {
    title: 'Дата публикации',
    dataIndex: 'date',
    key: 'date',
    render: DisplayDate,
    // sorter: true,
    sorter: (a: any, b: any) => a.date - b.date,
  },
  {
    title: 'Ссылка на пост',
    dataIndex: 'href',
    key: 'href',
    render: hrefToPost
  },
  {
    title: 'Фото',
    dataIndex: 'href',
    key: 'href',
    render: hrefToPostImg

  },
  {
    title: 'Цена',
    dataIndex: 'price',
    key: 'price',
    sorter: (a: any, b: any) => {
      if (a.price > b.price) {
        return 1;
      }
      if (a.price < b.price) {
        return -1;
      }
      // a должно быть равным b
      return 0;
    },
    responsive: [breakpointAntd],
  },

];

export const PostsTable = ({ postsData, loading }: { postsData: ParsedGroupType[], loading: boolean }) => {
  const data: DataType[] = [];
  postsData.forEach((group) => {
    group.data?.forEach((post) => {
      data.push({
        key: post.postId,
        groupName: group.name,
        text: post.text,
        price: post.price.toString(),
        date: post.date,
        href: post.post,
        hrefImg: post.imgPost
      });
    });
  });

  return (
    <Table
      className="posts_table"
      columns={columns}
      dataSource={data}
      bordered
      rowClassName="post-table-row"
      loading={loading}
      pagination={{
        position: ['topRight', 'bottomRight']
      }}
    />
  );
};
