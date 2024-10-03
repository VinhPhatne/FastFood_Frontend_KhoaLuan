import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Button } from "@mantine/core";
import Header from "./components/header/Header";
import Slider from "./components/slider/Slider";
import Card from "./components/card/Card";
import Footer from "./components/footer/Footer";
import Review from "./components/review/Review";
import Expert from "./components/expert/Expert";
import Suggest from "./components/suggest/Suggest";
import Advertise from "./components/advertise/Advertise";
import Experter from "./components/experter/Experter";
import Category from "./components/category/Category";
import Home from "./components/Home";
import DetailCourse from "./components/detailCourse/DetailCourse";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Card />} /> */}
          {/* <Route path="/category/:categoryId" element={<Category />} />
          <Header />
          <Slider />
          <Card />
          <Review />
          <Advertise />
          <Expert />
          <Experter />
          <Suggest />
          <Footer /> */}
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/detail/:id" element={<DetailCourse />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
