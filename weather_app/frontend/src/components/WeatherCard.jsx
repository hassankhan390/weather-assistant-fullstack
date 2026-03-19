import { useEffect, useState } from "react";
import API from "../services/api";

export default function WeatherCard({ record }) {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (!record) return;

    const fetchInsights = async () => {
      try {
        const res = await API.get(`/insight/${record.id}`);
        setInsights(res.data.insights);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInsights();
  }, [record]);

  if (!record) return null;

  return (
    <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-700">
      {/* City Name - Light and Elegant */}
      <h2 className="text-4xl font-light tracking-wide text-white capitalize mb-1">
        {record.location_input}
      </h2>
      
      {/* Huge Temperature Display - Extra Light weight */}
      <div className="relative">
        <span className="text-8xl font-extralight tracking-tighter text-white">
          {Math.round(record.temp)}°
        </span>
      </div>

      {/* Weather Condition */}
      <p className="text-lg text-white/70 capitalize mt-2 mb-8">
        {record.condition}
      </p>

      {/* Smart Insights - Glassmorphism Card */}
      <div className="glass-card rounded-[2rem] p-8 w-full max-w-md mt-4 text-left">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300 mb-4 opacity-80">
          Smart Insights
        </h3>
        <ul className="space-y-3">
          {insights.map((i, idx) => (
            <li key={idx} className="text-white/90 text-sm leading-relaxed flex items-start">
              <span className="mr-3 text-purple-400">•</span>
              {i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}