import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider, theme } from 'antd';
import store from './store/store';
import App from './App';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import 'antd/dist/reset.css';
import './index.css';

const { defaultAlgorithm, darkAlgorithm } = theme;

const ThemedApp = () => {
  const { darkMode } = useTheme();
  
  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          colorBgContainer: darkMode ? '#141414' : '#ffffff',
          colorText: darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
          colorBgElevated: darkMode ? '#1f1f1f' : '#ffffff',
        },
        components: {
          Card: {
            boxShadow: darkMode 
              ? '0 1px 3px rgba(0,0,0,0.3)' 
              : '0 1px 3px rgba(0,0,0,0.1)',
            borderRadiusLG: 8,
            colorBgContainer: darkMode ? '#141414' : '#ffffff',
          },
          Statistic: {
            titleFontSize: 14,
            contentFontSize: 24,
            colorText: darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
          },
          Button: {
            borderRadius: 4,
            controlHeight: 34,
          },
          Menu: {
            colorItemBg: darkMode ? '#141414' : '#ffffff',
            colorSubItemBg: darkMode ? '#1f1f1f' : '#fafafa',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </Provider>
);