import Editor from "@monaco-editor/react";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import VFileSystem from "../lib/fs";
import { useEffect, useState } from "react";
import { editor } from "monaco-editor";
import { useFS } from "../store/root";

// https://github.com/suren-atoyan/monaco-react

const options: editor.IEditorOptions = {
  minimap: { enabled: false }
};

const App = () => {
  // const [fs] = useState(new VFileSystem());
  // const fs = useFS();

  return (
    <Layout>
      <main>
        <Sidebar width={300} />
        <section>
          <Editor
            height="100%"
            language="javascript"
            theme="dark"
            options={options}
          />
        </section>
      </main>
      <style jsx>{`
        main {
          display: flex;
          height: 100vh;
        }

        section {
          overflow: hidden;
          flex: 1;
        }
      `}</style>
    </Layout>
  );
};

export default App;
