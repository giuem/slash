import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import EditorView from "../components/EditorView";
import SplitPane from "react-split-pane";

import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { useFS } from "../store";
import { Modal, message } from "antd";

const App = () => {
  const fs = useFS();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    acceptedFiles.map(file => {
      const path = ("/" + ((file as any).path || file.name)).replace("//", "/");
      const reader = new FileReader();
      // reader.onabort = () => console.log("file reading was aborted");
      // reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const str = reader.result;

        const writeFile = () => {
          const stat = fs.stats(path);
          if (stat) {
            if (stat.isDir) {
              message.warn(`${path} is dir, cannot be overwrite`);
              return;
            }
          }
          fs.writeFile(path, str as string);
        };

        if (fs.exists(path)) {
          Modal.confirm({
            title: "Do you want to overwrite file?",
            content: `${path} already exists`,
            onOk() {
              writeFile();
            }
          });
        } else {
          writeFile();
        }
      };
      reader.readAsText(file);
    });
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });
  return (
    <Layout>
      <main {...getRootProps()}>
        {isDragActive && (
          <div
            style={{
              position: "fixed",
              height: "100vh",
              width: "100vw",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <h1>Drop files or folder here.</h1>
          </div>
        )}

        <SplitPane
          split="vertical"
          minSize={150}
          maxSize={300}
          defaultSize={200}
        >
          <Sidebar width="100%" />
          <EditorView />
        </SplitPane>
        <input {...getInputProps()} />
      </main>
      <style jsx>{`
        main {
          display: flex;
          height: 100vh;
        }
      `}</style>
    </Layout>
  );
};

export default App;
