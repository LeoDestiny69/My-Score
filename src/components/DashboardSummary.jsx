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
  North: <Users className="w-6 h-6 text-blue-500" />,
  South: <Users className="w-6 h-6 text-green-500" />,
  East: <Users className="w-6 h-6 text-orange-400" />,
  West: <Users className="w-6 h-6 text-red-500" />,
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
            icon: iconMap[item.name] || <Users className="w-6 h-6 text-gray-500" />,
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/60 backdrop-blur-lg shadow-lg border border-gray-200 rounded-2xl p-6 animate-pulse"
          >
            <div className="w-6 h-6 bg-gray-200 rounded mx-auto mb-3" />
            <div className="h-3 w-16 bg-gray-200 rounded mx-auto mb-2" />
            <div className="h-5 w-24 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>
    );
  }

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

  return (
    <motion.div
      className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-4 mt-10 px-1"
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
              animate={isUpdated ? { scale: [1, 1.05, 1], boxShadow: "0 0 0 4px rgba(59,130,246,.4)" } : {}}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-lg shadow-lg border border-gray-200 rounded-2xl p-6 text-center hover:scale-105 hover:shadow-xl duration-300 min-w-[200px]"
            >
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className={`text-2xl font-extrabold mt-1 ${item.color}`}>
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
