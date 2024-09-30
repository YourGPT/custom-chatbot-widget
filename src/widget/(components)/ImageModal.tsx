import { motion } from "framer-motion";
import styled from "styled-components";

export default function ImageModal({ layoutId, src, onClose }: { layoutId?: string; src: string; onClose: () => any }) {
  return (
    <Root>
      <Inner>
        <motion.img layoutId={layoutId} src={src} />
        <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }} onClick={onClose} />

        <CloseBtn onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" height={24} width={24}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </CloseBtn>
      </Inner>
    </Root>
  );
}

const Root = styled(motion.div)`
  width: 100%;
  height: 100svh;
  position: fixed;
  z-index: 40;
  left: 0;
  top: 0;

  img {
    max-width: 90%;
    width: 800px;
    height: auto;
    max-height: 80vh;
    object-fit: contain;
    z-index: 4;
    position: relative;
  }
`;

const Inner = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled(motion.div)`
  background: rgba(0, 0, 0, 0.9);
  z-index: 2;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;
const CloseBtn = styled.button`
  all: unset;
  cursor: pointer;
  height: 42px;
  aspect-ratio: 1;
  border-radius: 120px;
  overflow: hidden;
  color: #fff;
  z-index: 3;
  border: 1px solid rgba(255, 255, 255, 0.8);
  opacity: 0.5;

  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    opacity: 1;
  }
`;
