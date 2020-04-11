import Editor from "@monaco-editor/react";
import Layout from "../components/Layout";
import VFileSystem from "../lib/fs";
import { useEffect, useState } from "react";

const App = () => {
  const [fs] = useState(new VFileSystem());

  useEffect(() => {
    window["fs"] = fs;
    return () => {
      delete window["fs"];
    };
  }, [fs]);

  fs.mkdirp("/a/b/c");
  fs.writeFile("/1.js", "");
  fs.writeFile("/a/2.js", "");
  fs.writeFile("/a/d/2.js", "");
  return (
    <Layout>
      <Editor height="100vh" language="javascript" />
    </Layout>
  );
};

export default App;
