import React from "react";
import Header from "./components/Header";
import DashboardSummary from "./components/DashboardSummary";
import SalesBarChart from "./components/SalesBarChart";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-100 to-white">
      <Header />

      {/* ✅ กล่องใหญ่ 100vh ลบความสูงของ header */}
      <div className="h-[calc(100vh-64px)] flex flex-col lg:grid lg:grid-cols-2 max-w-5xl mx-auto px-4">
        {/* กล่องสรุปคะแนน */}
        <div className="flex-1 overflow-auto p-2">
          <DashboardSummary />
        </div>

        {/* กล่องกราฟ */}
        <div className="flex-1 overflow-auto p-2">
          <SalesBarChart />
        </div>
      </div>
    </div>
  );
}


export default App;
