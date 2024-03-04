import React from "react";
import "./App.css";
import { Calendar } from "./components/calendar";
import { fixtures } from "./fixtures";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Calendar events={fixtures} />
      </header>
    </div>
  );
}

export default App;
