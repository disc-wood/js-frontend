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
  padding: 18px 40px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  position: relative;

  @media (max-width: 768px) {
    padding: 14px 20px;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    gap: 0;
  }
`;

const NavLinksGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const LogoMark = styled.div`
  width: 22px;
  height: 22px;
  background-color: #0C447C;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
`;

const LogoText = styled.h1`
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  line-height: 1;
  color: #0a0a0a;
  letter-spacing: -0.2px;
`;

const NavLink = styled.span`
  font-size: 13px;
  color: #555555;
  cursor: pointer;
  line-height: 1;
  transition: color 0.15s ease;

  &:hover {
    color: #0a0a0a;
  }
`;

const BaseButton = styled.button`
  border: 1px solid transparent;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  transition: transform 0.1s ease, background-color 0.15s ease, border-color 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const PrimaryButton = styled(BaseButton)`
  background-color: #0a0a0a;
  color: #ffffff;

  &:hover {
    background-color: #2a2a2a;
  }
`;

const SecondaryButton = styled(BaseButton)`
  background-color: #ffffff;
  color: #0a0a0a;
  border-color: #d4d4d4;

  &:hover {
    border-color: #0a0a0a;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
  }
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555555;
  transition: color 0.15s ease;

  &:hover {
    color: #0a0a0a;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  align-items: center;
  justify-content: center;
  color: #0a0a0a;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: #ffffff;
    border-bottom: 1px solid #eaeaea;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    z-index: 50;
  }
`;

const MobileMenuLink = styled.button`
  width: 100%;
  text-align: left;
  padding: 14px 20px;
  background: none;
  border: none;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
  font-family: inherit;
  color: #0a0a0a;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #fafafa;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  font-size: 13px;
  font-family: inherit;
  background: none;
  border: none;
  cursor: pointer;
  color: #0a0a0a;

  &:hover {
    background: #f5f5f5;
  }
`;

// --- Component ---

export default function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { role } = useUserRole();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
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

  const navigateAndClose = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <StyledNav ref={mobileMenuRef}>
      <LeftGroup>
        <LogoGroup onClick={() => navigate('/')}>
          <LogoMark>L</LogoMark>
          <LogoText>LearnerTrack</LogoText>
        </LogoGroup>
        <NavLinksGroup>
          <NavLink onClick={() => navigate('/dashboard')}>Dashboard</NavLink>
          <NavLink onClick={() => navigate('/database')}>Database</NavLink>
          <NavLink onClick={() => navigate('/communications')}>Communications</NavLink>
        </NavLinksGroup>
      </LeftGroup>

      <RightGroup>
        {user ? (
          <>
            {role === 'admin' && (
              <DropdownWrapper ref={dropdownRef}>
                <SettingsButton onClick={() => setIsDropdownOpen(prev => !prev)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </SettingsButton>
                {isDropdownOpen && (
                  <Dropdown>
                    <DropdownItem onClick={() => { navigate('/manage-access'); setIsDropdownOpen(false); }}>
                      Manage access
                    </DropdownItem>
                  </Dropdown>
                )}
              </DropdownWrapper>
            )}
            <SecondaryButton onClick={handleLogoutClick}>Log out</SecondaryButton>
          </>
        ) : (
          <>
            <NavLink onClick={() => navigate('/login')}>Sign in</NavLink>
            <PrimaryButton onClick={() => navigate('/signup')}>Get started</PrimaryButton>
          </>
        )}

        <HamburgerButton onClick={() => setIsMobileMenuOpen(prev => !prev)} aria-label="Toggle menu">
          {isMobileMenuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </HamburgerButton>
      </RightGroup>

      <MobileMenu $open={isMobileMenuOpen}>
        <MobileMenuLink onClick={() => navigateAndClose('/dashboard')}>Dashboard</MobileMenuLink>
        <MobileMenuLink onClick={() => navigateAndClose('/database')}>Database</MobileMenuLink>
        <MobileMenuLink onClick={() => navigateAndClose('/communications')}>Communications</MobileMenuLink>
        {user && role === 'admin' && (
          <MobileMenuLink onClick={() => navigateAndClose('/manage-access')}>Manage access</MobileMenuLink>
        )}
      </MobileMenu>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onLogout={handleLogoutConfirm}
      />
    </StyledNav>
  );
}