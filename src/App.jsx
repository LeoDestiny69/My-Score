import React from "react";
import Header from "./components/Header";
import DashboardSummary from "./components/DashboardSummary";
import SalesBarChart from "./components/SalesBarChart";
import ScoreBoard from "./components/ScoreBoard";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-100 to-white">
      {/* 🔹 Full-width Header */}
      <Header />

      {/* 🔸 Limited-width content */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <DashboardSummary />
        <SalesBarChart />
      </div>
    </div>
  );
}

export default App;
