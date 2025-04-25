import React from "react";
import Slider from "./slider/Slider";
import Card from "./card/Card";
import Recommendations from './card/Recommendations';
import ChatbotComponent from './card/Chatbot';

const Home = () => {
  return (
    <div>
      <Slider />
      {/* <Recommendations /> */}
      <Card />
      {/* <ChatbotComponent /> */}
    </div>
  );
};

export default Home;
