// src/components/Layout.js

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  text-align: center;
`;

const Header = styled.header`
  background-color: #333;
  color: #fff;
  padding: 1rem;
`;

const Content = styled.main`
  padding: 1rem;
`;

const Layout = ({ children }) => {
  return (
    <Container>
      <Header>
        <h1>Photo Guessing Game</h1>
      </Header>
      <Content>
        {children}
      </Content>
    </Container>
  );
};

export default Layout;