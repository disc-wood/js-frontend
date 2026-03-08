import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '@/common/contexts/UserContext';
import LogoutModal from './LogoutModal';

// --- Styled Components ---

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  background-color: #E2F3FF; 
  color: white;
  /* Matching the clean, modern font-family from the first image */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center; /* Vertically centers Logo and About */
  gap: 35px;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center; /* Vertically centers Sign In and Get Started button */
  gap: 25px; /* Increased gap slightly for better breathing room */
`;

const LogoText = styled.h1`
  font-size: 32px;
  font-weight: 400;
  margin: 0;
  line-height: 1; /* Prevents extra spacing above/below the letters */
  cursor: pointer;
  color: #000000;
  letter-spacing: -0.5px;
`;

const NavLink = styled.span`
  font-size: 15px;
  color: #000000;
  opacity: 0.85;
  cursor: pointer;
  /* margin-top: 4px;  <-- REMOVED THIS */
  line-height: 1; /* Keeps text height consistent */
  
  &:hover {
    opacity: 1;
  }
`;

const BaseButton = styled.button`
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  color: #ffffff;
  font-family: inherit;
  display: flex;         /* Added to help center text inside button */
  align-items: center;   /* Added to help center text inside button */
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const GetStartedButton = styled(BaseButton)`
  background-color: #000000; 
`;

// --- Component ---

export default function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogoutClick = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setIsModalOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <StyledNav>
      <LeftGroup>
        <LogoText onClick={() => navigate('/')}>
          Learner Tracking System
        </LogoText>
        <NavLink onClick={() => navigate('/about')}>About</NavLink>
        <NavLink onClick={() => navigate('/dashboard')}>Dashboard</NavLink>
        <NavLink onClick={() => navigate('/database')}>Database</NavLink>
        <NavLink onClick={() => navigate('/communications')}>Communications</NavLink>
      </LeftGroup>

      <RightGroup>
        {user ? (
          <SignInButton onClick={handleLogoutClick}>Log Out</SignInButton>
        ) : (
          <>
            <NavLink onClick={() => navigate('/login')}>
              Sign In
            </NavLink>
            <GetStartedButton onClick={() => navigate('/signup')}>
              Get Started
            </GetStartedButton>
          </>
        )}
      </RightGroup>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onLogout={handleLogoutConfirm}
      />
    </StyledNav>
  );
}