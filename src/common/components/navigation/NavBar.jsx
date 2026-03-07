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
  background-color: #5d8e8a; 
  color: white;
  /* Matching the clean, modern font-family from the first image */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 35px;
`;

const RightGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const LogoText = styled.h1`
  font-size: 32px; /* Slightly larger as per the first image */
  font-weight: 400; /* Lighter weight to match the clean look */
  margin: 0;
  cursor: pointer;
  color: #ffffff; /* Explicitly white */
  letter-spacing: -0.5px;
`;

const NavLink = styled.span`
  font-size: 15px;
  color: #ffffff; /* Changed from dark to white */
  opacity: 0.85;
  cursor: pointer;
  margin-top: 4px; 
  
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
  color: #ffffff; /* Ensuring button text is pure white */
  font-family: inherit;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const SignInButton = styled(BaseButton)`
  background-color: #b37659; 
`;

const GetStartedButton = styled(BaseButton)`
  background-color: #7b5d8e; 
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
      </LeftGroup>

      <RightGroup>
        {user ? (
          <SignInButton onClick={handleLogoutClick}>Log Out</SignInButton>
        ) : (
          <>
            <SignInButton onClick={() => navigate('/login')}>
              Sign In
            </SignInButton>
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