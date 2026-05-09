import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '@/common/contexts/UserContext';
import { useUser as useUserRole } from '@/common/hooks/useUser';
import LogoutModal from './LogoutModal';

// --- Styled Components ---

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  background-color: #E2F3FF;
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 35px;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  position: relative;
`;

const LogoText = styled.h1`
  font-size: 32px;
  font-weight: 400;
  margin: 0;
  line-height: 1;
  cursor: pointer;
  color: #000000;
  letter-spacing: -0.5px;
`;

const NavLink = styled.span`
  font-size: 15px;
  color: #000000;
  opacity: 0.85;
  cursor: pointer;
  line-height: 1;

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
  display: flex;
  align-items: center;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const GetStartedButton = styled(BaseButton)`
  background-color: #000000;
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  opacity: 0.7;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  font-size: 14px;
  font-family: inherit;
  background: none;
  border: none;
  cursor: pointer;
  color: #000000;

  &:hover {
    background: #f3f4f6;
  }
`;

// --- Component ---

export default function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { role } = useUserRole();
  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <NavLink onClick={() => navigate('/dashboard')}>Dashboard</NavLink>
        <NavLink onClick={() => navigate('/database')}>Database</NavLink>
        <NavLink onClick={() => navigate('/communications')}>Communications</NavLink>
      </LeftGroup>

      <RightGroup>
        {user ? (
          <>
            {role === 'admin' && (
              <DropdownWrapper ref={dropdownRef}>
                <SettingsButton onClick={() => setIsDropdownOpen(prev => !prev)}>
                  {/* gear icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </SettingsButton>
                {isDropdownOpen && (
                  <Dropdown>
                    <DropdownItem onClick={() => { navigate('/manage-access'); setIsDropdownOpen(false); }}>
                      Manage Access
                    </DropdownItem>
                  </Dropdown>
                )}
              </DropdownWrapper>
            )}
            <GetStartedButton onClick={handleLogoutClick}>Log Out</GetStartedButton>
          </>
        ) : (
          <>
            <NavLink onClick={() => navigate('/login')}>Sign In</NavLink>
            <GetStartedButton onClick={() => navigate('/signup')}>Get Started</GetStartedButton>
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