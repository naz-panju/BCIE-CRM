// components/PdfViewer.js
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';

const PdfViewer = ({ fileUrl }) => {
  return (
    <div style={{ height: '320px' }}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={fileUrl}
          defaultScale={SpecialZoomLevel.PageFit}
        />
      </Worker>
    </div>
  );
};

export default PdfViewer;
