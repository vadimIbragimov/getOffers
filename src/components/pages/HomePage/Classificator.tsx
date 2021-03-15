import React, { FunctionComponent, useEffect, useState } from "react";
import { Tree } from 'antd';
import { ClassificatorType } from "./types";
import { DataNode } from "rc-tree/lib/interface";
import { parsePath, PathItemObjType } from "./utils/pathParser";
import { serverAddress } from "../../../constants";

type ClassificatorProps = {
  onChange?: (groups: ClassificatorType) => void;
  className?: string;
}

export const Classificator = ({ onChange, className }: ClassificatorProps) => {

  const [classificator, setClassificator] = useState<DataNode[]>([]);
  useEffect(() => {
    fetch(`${serverAddress}api/classificator`)
      .then((response) => response.json())
      .then((data) => {
        const classificator: ClassificatorType = data;
        const resData = classificator.map((brand) => ({
          title: brand.name,
          key: brand.name,
          children: brand.series?.map((seriesItem) => ({
            title: seriesItem.name,
            key: `${brand.name}/${seriesItem.name}`,
            children: seriesItem.models?.map((model) => ({
              title: model.name,
              key: `${brand.name}/${seriesItem.name}/${model.name}`,
            }))
          }))
        }));
        setClassificator(resData);
      });
  }, []);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
    
  };

  const onCheck = (checkedKeys: any, info: any) => {
    const paths: PathItemObjType[] = parsePath(checkedKeys.checked);
    const classificator: ClassificatorType = paths?.map((brand) =>({
      id: "0",
      name: brand.text || '',
      series: brand.children?.map((series) => ({
        name: series.text || '',
        models: series.children?.map((model) => ({
          name: model.text || ''
        }))
      })),
    })) || [];
    onChange?.(classificator);
  };

  return (
    <Tree
    className={className}
      checkable
      checkStrictly={true}
      selectable={false}
      onCheck={onCheck}
      treeData={classificator}
    />
  );
};