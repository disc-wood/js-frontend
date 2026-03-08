import { Outlet } from 'react-router-dom';

import styled from 'styled-components';

import NavBar from '@/common/components/navigation/NavBar';

import Footer from '@/common/components/navigation/Footer';

const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #C0E6FF;
`;

export default function NavLayout() {
  return (
    <Layout>
      <NavBar />
      <Outlet />
      <Footer />
    </Layout>
  );
}
