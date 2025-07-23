import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const colors = [
  "bg-gradient-to-r from-red-400 to-red-500",
  "bg-gradient-to-r from-orange-400 to-orange-500",
  "bg-gradient-to-r from-yellow-400 to-yellow-500",
  "bg-gradient-to-r from-green-400 to-green-500",
  "bg-gradient-to-r from-teal-400 to-teal-500",
  "bg-gradient-to-r from-blue-400 to-blue-500",
  "bg-gradient-to-r from-indigo-400 to-indigo-500",
  "bg-gradient-to-r from-purple-400 to-purple-500",
  "bg-gradient-to-r from-pink-400 to-pink-500",
];

const SalesBarChart = () => {
  const [data, setData] = useState([]);
  const [animatedPoints, setAnimatedPoints] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/scores");
        setData(res.data);

        const newAnimated = {};
        res.data.forEach((item) => {
          newAnimated[item.name] = item.points;
        });
        setAnimatedPoints(newAnimated);
      } catch (err) {
        console.error("Failed to fetch sales data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...data.map((item) => item.points), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200 p-8 shadow-xl mt-10"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        🔢 Total Points by Group
      </h2>

      <div className="space-y-6">
        <AnimatePresence>
          {data.map((item, i) => {
            const percentage = (item.points / maxValue) * 100;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                exit={{ opacity: 0 }}
                className="space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">{item.name}</span>
                  <motion.span
                    className="text-gray-800 font-semibold tabular-nums"
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {animatedPoints[item.name]?.toLocaleString()}
                  </motion.span>
                </div>

                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${colors[i % colors.length]}`}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SalesBarChart;
