import React from "react";
import Header from "./components/Header";
import DashboardSummary from "./components/DashboardSummary";
import SalesBarChart from "./components/SalesBarChart";

function App() {
  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-b from-neutral-100 to-white">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        <div className="max-h-[95vh] overflow-auto">
          <DashboardSummary />
        </div>
        <SalesBarChart />
      </div>
    </div>
  );
}

export default App;
