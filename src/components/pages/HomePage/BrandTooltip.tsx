import React from 'react';
import { EnterOutlined } from '@ant-design/icons';
import './style/BrandTooltip.less';

export const  BrandTooltip = () => (
  <div className="brand-tooltip ">
    {/* <EnterOutlined rotate={90} className="brand-tooltip-icon" /> */}
    <link rel="stylesheet" href="https://cdn.linearicons.com/free/1.0.0/icon-font.min.css"></link>
    <span className="lnr lnr-arrow-up animate__animated animate__bounceInLeft"></span> 
    <article className="brand-tooltip-text">
      Выберите бренд
      <br />
      или модель
    </article>
  </div>
);
