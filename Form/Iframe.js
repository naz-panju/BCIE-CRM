import React from 'react';

const IframeComponent = ({ src }) => {
  return (
    <iframe
      src={src}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      width="100%"
      height="500px"
      style={{ border: 'none' }}
    />
  );
};

export default IframeComponent;