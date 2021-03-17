import React, { useEffect, useState } from "react";
import { Checkbox, CheckboxOptionType, Col, message, Row, Tree } from 'antd';
import './style/Groups.less';
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { serverAddress } from "../../../constants";

export const Groups = ({ onChange }: { onChange?: (groups: string[]) => void }) => {

  const [checkBoxesData, setCheckBoxesData] = useState<CheckboxOptionType[]>([]);
  const [checkedGroups1, setCheckedGroups1] = useState<CheckboxValueType[]>([]);
  const [checkedGroups2, setCheckedGroups2] = useState<CheckboxValueType[]>([]);

  useEffect(() => {
    onChange?.([...checkedGroups1.map(v => v.toString()), ...checkedGroups2.map(v => v.toString())])
  }, [checkedGroups1, checkedGroups2]);

  useEffect(() => {
    fetch(`${serverAddress}api/groups`)
      .then((response) => response.json())
      .then((data) => {
        const groups: { name: string, href: string }[] = data;
        setCheckBoxesData(
          groups.map((sourceGroup) => ({
            label: sourceGroup.name,
            value: sourceGroup.name,
          }))
        )
      })
      .catch((e) => message.error({
        content: `Ошибка ${e.message}`,
        duration: 5
      }))
  }, []);


  return (
    <div>
      <Row className="groups-selector">
        <Col>
          <Checkbox.Group
            className="checkBox-Col"
            options={checkBoxesData.slice(0, Math.ceil(checkBoxesData.length / 2))}
            onChange={(checkedValue) => setCheckedGroups1(checkedValue)}
          />
        </Col>
        <Col>
          <Checkbox.Group
            className="checkBox-Col"
            options={checkBoxesData.slice(Math.ceil(checkBoxesData.length / 2), checkBoxesData.length)}
            onChange={(checkedValue) => setCheckedGroups2(checkedValue)}
          />
        </Col>
      </Row>

    </div>

  );
};