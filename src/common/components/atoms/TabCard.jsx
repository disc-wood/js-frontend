import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TAB_TRIANGLE_BLUE = '#e0f2fe';
const TAB_INACTIVE_GRAY = '#d1d5db';
const CARD_BG = '#f3f3f3';
const TEXT_MUTED = '#6b7280';

const TabCardWrapper = styled.div`
  background: ${CARD_BG};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const Tabs = styled.div`
  display: flex;
  align-items: stretch;
  background: ${TAB_TRIANGLE_BLUE};
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.65rem 1.5rem;
  font-size: 0.95rem;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  color: ${({ $active }) => ($active ? 'var(--text)' : TEXT_MUTED)};
  background: ${({ $active }) => ($active ? CARD_BG : TAB_INACTIVE_GRAY)};
  border: none;
  border-radius: ${({ $first }) => ($first ? '0 16px 0 0' : '16px 0 0 0')};
  cursor: pointer;
  position: relative;
  z-index: ${({ $active }) => ($active ? 1 : 0)};

  &:hover {
    color: var(--text);
    background: ${({ $active }) => ($active ? CARD_BG : '#c9cdd3')};
  }
`;

export default function TabCard({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TabCardWrapper>
      <Tabs>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.label}
            type='button'
            $active={activeTab === index}
            $first={index === 0}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>
      {tabs[activeTab].content}
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