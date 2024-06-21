// components/PdfViewer.js
import React from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const PdfViewer = ({ fileUrl }) => {
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        {/* <div style={{ flexGrow: 0 }}>
          <Toolbar />
        </div> */}
        <div style={{ flexGrow: 1, height: '320px' }}>
          <Viewer
            fileUrl={fileUrl}
            defaultScale={SpecialZoomLevel.PageFit}
            // plugins={[toolbarPluginInstance]}
          />
        </div>
      </Worker>
    </div>
  );
};

export default PdfViewer;
