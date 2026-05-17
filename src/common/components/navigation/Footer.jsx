import styled from 'styled-components';

// --- Styled Components ---

const StyledFooter = styled.footer`
  display: flex;
  align-items: center;
  padding: 16px 40px;
  background-color: #ffffff;
  border-top: 1px solid #eaeaea;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const FooterText = styled.p`
  font-size: 12px;
  color: #888888;
  margin: 0;
  font-weight: 400;
`;

// --- Component ---

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      <FooterText>
        © {currentYear} LearnerTrack. All rights reserved.
      </FooterText>
    </StyledFooter>
  );
}
