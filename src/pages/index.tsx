import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import EditorView from "../components/EditorView";

const App = () => {
  return (
    <Layout>
      <main>
        <Sidebar width={240} />
        <EditorView />
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
