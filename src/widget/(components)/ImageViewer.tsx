import React, { useState } from "react";
import styled from "styled-components";

interface ImageViewerProps {
  src: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src }) => {
  const [isImageViewerOpen, setImageViewerOpen] = useState(false);

  const openImageViewer = () => {
    setImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
  };

  return (
    <>
      <ThumbImage src={src} alt="Image" onClick={openImageViewer} />
      {isImageViewerOpen && (
        <ImageViewerOverlay onClick={closeImageViewer}>
          <ImageViewerImage src={src} alt="Full Screen" onClick={(e) => e.stopPropagation()} />
        </ImageViewerOverlay>
      )}
    </>
  );
};

export default ImageViewer;

const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  border-radius: 5px;
  max-height: 250px;
  margin-bottom: 10px;
`;

const ImageViewerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(1px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ImageViewerImage = styled.img`
  border-radius: 10px;
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  cursor: pointer;
`;
