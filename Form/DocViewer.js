import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

export default function DocView({doc}) {
  const docs = [
    { uri: "https://url-to-my-pdf.pdf" }, // Remote file
    // { uri: require("./example-files/pdf.pdf") }, // Local File
  ];

  return <div style={{ height: '320px'}}><DocViewer documents={[{uri:doc}]} /></div>;
}