import styled from "styled-components";
import { motion } from "framer-motion";

export default function SettingModal() {
  return (
    <Root
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 10,
      }}
    >
      <Inner>
        <Overlay />

        <Content>
          <div className="inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>

            <div>Language</div>
          </div>
        </Content>
      </Inner>
    </Root>
  );
}

const Root = styled(motion.div)`
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 20;
`;
const Inner = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;
const Overlay = styled.div`
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;
  position: absolute;
`;
const Content = styled.div`
  height: 70%;
  margin-top: auto;
  width: 100%;
  background: var(--yourgptChatbotSurfaceColor);
  z-index: 12;
  position: relative;
  border-radius: 20px 20px 0 0;

  .inner {
    /* ygpt-flex ygpt-gap-2 ygpt-px-4 ygpt-py-4 ygpt-items-center */
    display: flex;
    gap: 8px;
    padding: 16px;
    align-items: center;
  }
`;
