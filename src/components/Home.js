import React from "react";
import Slider from "./slider/Slider";
import Card from "./card/Card";
import Recommendations from './card/Recommendations';

const Home = () => {
  return (
    <div>
      <Slider />
      {/* <Recommendations /> */}
      <Card />
    </div>
  );
};

export default Home;
