import { Outlet, useLocation } from 'react-router-dom';

import styled, { keyframes } from 'styled-components';

import NavBar from '@/common/components/navigation/NavBar';
import Footer from '@/common/components/navigation/Footer';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;

const PageTransition = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  animation: ${fadeUp} 0.3s ease-out both;
`;

export default function NavLayout() {
  const location = useLocation();
  return (
    <Layout>
      <NavBar />
      <PageTransition key={location.pathname}>
        <Outlet />
      </PageTransition>
      <Footer />
    </Layout>
  );
}