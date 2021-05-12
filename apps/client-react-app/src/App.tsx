import React from 'react';
import './styles/App.less';
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ConfigProvider } from 'antd';
import ru from 'antd/lib/locale/ru_RU';

export const App = () => {
  return (
    <ConfigProvider 
      locale={ru}
    >
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ConfigProvider>
  );
};

