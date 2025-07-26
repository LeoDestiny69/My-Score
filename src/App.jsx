import React from "react";
import Header from "./components/Header";
import DashboardSummary from "./components/DashboardSummary";
import SalesBarChart from "./components/SalesBarChart";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-100 to-white">
      <Header />

      {/* ⚡️ กำหนดพื้นที่แสดงแบบเต็มจอ (mobile) */}
      <div className="h-[calc(100vh-64px)] flex flex-col lg:block max-w-5xl mx-auto px-4">
        <div className="flex-1 overflow-hidden">
          <DashboardSummary />
        </div>
        <div className="flex-1 overflow-hidden">
          <SalesBarChart />
        </div>
      </div>
    </div>
  );
}

export default App;
