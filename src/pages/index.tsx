import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import EditorView from "../components/EditorView";
import SplitPane from "react-split-pane";

const App = () => {
  return (
    <Layout>
      <main>
        <SplitPane
          split="vertical"
          minSize={150}
          maxSize={300}
          defaultSize={200}
        >
          <Sidebar width="100%" />
          <EditorView />
        </SplitPane>
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
