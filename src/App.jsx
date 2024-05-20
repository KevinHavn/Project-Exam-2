import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout/Index";
import Home from './Pages/Home';
import About from './Pages/About';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
};

export default App;
