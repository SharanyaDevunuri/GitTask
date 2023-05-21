import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ContentArea from "./components/ContentArea";

function App() {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
  };

  return (
    <div className="App">
      <Sidebar
        handleButtonClick={handleButtonClick}
        selectedButton={selectedButton}
      />
      <ContentArea selectedButton={selectedButton} />
    </div>
  );
}

export default App;
