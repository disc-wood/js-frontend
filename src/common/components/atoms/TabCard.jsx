import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const CARD_BG = '#ffffff';
const TAB_BAR_BG = '#fafafa';
const TAB_INACTIVE_BG = '#f3f3f3';
const TAB_INACTIVE_HOVER = '#eaeaea';
const BORDER_COLOR = '#d4d4d4';
const TEXT_PRIMARY = '#0a0a0a';
const TEXT_MUTED = '#6b7280';

const TabCardWrapper = styled.div`
  background: ${CARD_BG};
  border: 1.5px solid ${BORDER_COLOR};
  border-radius: 12px;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Tabs = styled.div`
  display: flex;
  align-items: stretch;
  background: ${TAB_BAR_BG};
  border-bottom: 1.5px solid ${BORDER_COLOR};
`;

const ContentPanel = styled.div`
  animation: ${fadeIn} 0.25s ease-out both;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.65rem 1.5rem;
  font-size: 0.95rem;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  color: ${({ $active }) => ($active ? TEXT_PRIMARY : TEXT_MUTED)};
  background: ${({ $active }) => ($active ? CARD_BG : TAB_INACTIVE_BG)};
  border: none;
  cursor: pointer;
  position: relative;
  z-index: ${({ $active }) => ($active ? 1 : 0)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: inherit;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    color: ${TEXT_PRIMARY};
    background: ${({ $active }) => ($active ? CARD_BG : TAB_INACTIVE_HOVER)};
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.5rem;
    font-size: 0.7rem;
  }
`;

export default function TabCard({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) {
    return null; // or loading state
  }

  const safeIndex = Math.min(activeTab, tabs.length - 1);

  return (
    <TabCardWrapper>
      <Tabs>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.label}
            type="button"
            $active={safeIndex === index}
            $first={index === 0}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>

      <ContentPanel key={safeIndex}>
        {tabs[safeIndex]?.content}
      </ContentPanel>
    </TabCardWrapper>
  );
}

TabCard.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
};