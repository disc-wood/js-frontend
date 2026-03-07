import styled from 'styled-components';

// --- Styled Components ---

const StyledFooter = styled.footer`
  display: flex;
  align-items: center;
  padding: 20px 40px; /* Increased vertical padding for a clean look */
  background-color: #ffffff; /* White background as per your footer image */
  border-top: 1px solid #e0e0e0; /* Subtle line seen in the screenshot */
  
  /* Matching the clean, modern font-family from the NavBar */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #555555; /* Darker grey for readability on white background */
  margin: 0;
  font-weight: 400;
`;

// --- Component ---

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      <FooterText>
        LearnerTrack. All rights reserved © {currentYear}
      </FooterText>
    </StyledFooter>
  );
}