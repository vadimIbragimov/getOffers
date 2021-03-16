import React from 'react';
import { EnterOutlined } from '@ant-design/icons';
import './style/BrandTooltip.less';

export const  BrandTooltip = () => (
  <div className="brand-tooltip">
    <EnterOutlined rotate={90} className="brand-tooltip-icon" />
    <article className="brand-tooltip-text">
      Нажмите на кнопку
      <br />
      чтобы выбрать бренд
    </article>
  </div>
);
