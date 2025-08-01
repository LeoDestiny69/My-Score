import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

const colorMap = {
  North: "text-blue-600",
  South: "text-green-600",
  East: "text-orange-500",
  West: "text-red-500",
};

const iconMap = {
  North: <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" />,
  South: <Users className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" />,
  East: <Users className="w-4 h-4 sm:w-6 sm:h-6 text-orange-400" />,
  West: <Users className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" />,
};

const AnimatedNumber = ({ value, duration = 0.6 }) => {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const start = startRef.current;
    const end = value;
    const d = duration * 1000;

    let frame;
    const tick = (ts) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const progress = Math.min((ts - startTimeRef.current) / d, 1);
      const current = Math.round(start + (end - start) * progress);
      setDisplay(current);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        startRef.current = end;
        startTimeRef.current = null;
      }
    };

    cancelAnimationFrame(frame);
    requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
};

const DashboardSummary = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedIds, setUpdatedIds] = useState(new Set());
  const prevDataRef = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/scores`);
        const incoming = res.data || [];

        const changed = new Set();
        incoming.forEach((item) => {
          const prev = prevDataRef.current[item.name];
          if (prev !== undefined && prev !== item.points) {
            changed.add(item.name);
          }
        });
        setUpdatedIds(changed);

        const prevMap = {};
        incoming.forEach((i) => (prevMap[i.name] = i.points));
        prevDataRef.current = prevMap;

        setSummaryData(
          incoming.map((item) => ({
            key: item.name,
            label: item.name,
            points: Number(item.points) || 0,
            color: colorMap[item.name] || "text-gray-700",
            icon: iconMap[item.name] || <Users className="w-4 h-4 text-gray-500" />,
          }))
        );
      } catch (error) {
        console.error("Fetch data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 8 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-3 sm:p-6 animate-pulse shadow border" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {summaryData.map((item) => {
          const isUpdated = updatedIds.has(item.label);
          return (
            <motion.div
              key={item.key}
              variants={cardVariants}
              layout
              animate={isUpdated ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-lg shadow border border-gray-200 rounded-xl p-3 sm:p-6 text-center text-xs sm:text-base hover:shadow-md duration-200"
            >
              <div className="flex justify-center mb-2">{item.icon}</div>
              <p className="text-gray-500 font-medium">{item.label}</p>
              <p className={`font-extrabold mt-1 text-lg sm:text-2xl ${item.color}`}>
                <AnimatedNumber value={item.points} />
              </p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardSummary;
