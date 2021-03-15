import React, { Suspense } from "react";
import { Layout } from 'antd';
import { Header } from "./Header";
import Router from "./Router";
import '../styles/AppLayout.less';
import { Spin } from "./Spin";

export const AppLayout = () => (
  <Layout id="app">
    <Header />
    <Layout.Content className="app-content">
      <Suspense fallback={<Spin />}>
        <Router />
      </Suspense>
    </Layout.Content>
  </Layout>
);