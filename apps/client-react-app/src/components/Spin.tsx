import React from 'react';
import { Spin } from 'antd';
import '../styles/Spin.less'

const AppSpin = () => <div className="app-spinner">
    <Spin size="large"/>
</div>;

export {AppSpin as Spin};