import React, { useState, useMemo, useEffect } from "react";
import { Search, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "../assets/background.jpg";

const ScoreBoard = () => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/scores");
      if (!res.ok) throw new Error("เชื่อมต่อ API ไม่ได้");
      const data = await res.json();
      setScores(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredScores = useMemo(() => {
    return scores
      .filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.points - a.points);
  }, [searchTerm, scores]);

  const getRankIcon = (index) => (
    <span className="text-base font-semibold text-gray-700">{index + 1}.</span>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <p className="text-sm text-gray-400">กำลังโหลดข้อมูล...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-red-500 text-center">{error}</p>
        </div>
      );
    }

    if (filteredScores.length === 0) {
      return (
        <p className="text-center text-sm text-gray-400 py-20">
          {searchTerm ? `ไม่พบ "${searchTerm}"` : "ยังไม่มีข้อมูลคะแนน"}
        </p>
      );
    }

    return (
      <ul className="space-y-3">
        <AnimatePresence>
          {filteredScores.map((person, index) => (
            <motion.li
              key={person.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white/90 backdrop-blur p-4 shadow-md hover:bg-gray-50 hover:ring-1 hover:ring-violet-200 transform hover:scale-[1.01] transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center">{getRankIcon(index)}</div>
                <span className="text-base font-medium text-gray-900">
                  {person.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-violet-500">
                  {person.points}
                </div>
                <div className="text-xs text-gray-400">คะแนน</div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    );
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-neutral-100 to-white py-12 px-4 flex flex-col items-center"
    >
      <div className="w-full max-w-2xl space-y-8">

        {/* Title */}
        <div className="text-center space-y-2 mt-4">
          <h1 className="text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            📊 Leaderboard
          </h1>
          <p className="text-sm text-gray-500 tracking-wide leading-relaxed">
            ตรวจสอบอันดับของคุณ และพัฒนาคะแนนให้ดียิ่งขึ้น
          </p>
        </div>

        {/* Search Input */}
        <motion.div
          animate={{
            scale: isSearching ? 1.02 : 1,
            boxShadow: isSearching
              ? "0 0 0 3px rgba(139, 92, 246, 0.3)"
              : "0 0 0 0px transparent",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative rounded-lg"
        >
          <input
            type="text"
            placeholder="🔍 ค้นหาชื่อ..."
            value={searchTerm}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-9 py-2 text-sm bg-white/80 backdrop-blur border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400"
            >
              ✕
            </button>
          )}
        </motion.div>

        {/* Search Result Count */}
        {searchTerm && filteredScores.length > 0 && (
          <p className="text-xs text-gray-500 mt-1 ml-2">
            พบ {filteredScores.length} รายชื่อที่ตรงกับ "{searchTerm}"
          </p>
        )}
        {searchTerm && filteredScores.length === 0 && (
          <p className="text-xs text-red-400 mt-1 ml-2 italic">
            ไม่พบข้อมูลที่ตรงกับ "{searchTerm}"
          </p>
        )}

        {/* Score List */}
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-gray-200 p-6 transition-all">
          <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
            🏆 Top Scores ({filteredScores.length})
          </h2>
          {renderContent()}
        </div>
      </div>
    </motion.main>
  );
};

export default ScoreBoard;
