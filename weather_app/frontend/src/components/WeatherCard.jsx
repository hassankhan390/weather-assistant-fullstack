import { useEffect, useState } from "react";
import API from "../services/api";

export default function WeatherCard({ record }) {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (!record) return;
    const fetchInsights = async () => {
      try {
        const res = await API.get(`/insight/${record.id}`);
        setInsights(res.data.insights || []);
      } catch (err) { console.error(err); }
    };
    fetchInsights();
  }, [record]);

  if (!record) return null;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_OR_USE_EMBED_LINK&q=${record.location_input}`;
  const youtubeUrl = `https://www.youtube.com/results?search_query=travel+guide+${record.location_input}`;

  return (
    <div className="flex flex-col items-center py-6 animate-in fade-in zoom-in duration-1000">
      <h2 className="text-5xl font-extralight tracking-widest text-white mb-2">{record.location_input}</h2>
      <div className="flex items-center gap-6 mb-10">
        <span className="text-8xl font-thin text-white">{Math.round(record.temp)}°</span>
        <p className="text-xl text-white/50 tracking-widest uppercase">{record.condition}</p>
      </div>

      {/* Requirement 2.2: Google Maps */}
      <div className="glass-card w-full max-w-3xl h-64 rounded-[2.5rem] overflow-hidden mb-8 border border-white/10 shadow-2xl">
        <iframe title="map" width="100%" height="100%" className="opacity-70 contrast-125"
          src={`https://maps.google.com/maps?q=${record.location_input}&t=&z=13&ie=UTF8&iwloc=&output=embed`} 
          allowFullScreen></iframe>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Requirement 2.2: Smart Insights */}
        <div className="glass-card p-8 rounded-[2rem] text-left">
          <h3 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4">Smart AI Insights</h3>
          <ul className="space-y-3">
            {insights.map((i, idx) => (
              <li key={idx} className="text-white/80 text-xs flex items-start">
                <span className="mr-2 text-purple-500">•</span>{i}
              </li>
            ))}
          </ul>
        </div>

        {/* Requirement 2.2: YouTube Integration */}
        <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between">
          <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">Explore Multimedia</h3>
          <p className="text-white/40 text-xs mb-6 italic">Discover local guides for {record.location_input}.</p>
          <a href={youtubeUrl} target="_blank" rel="noreferrer" 
             className="bg-white/5 border border-white/10 py-3 rounded-xl text-center text-[10px] font-bold text-white hover:bg-red-500/20 transition-all">
             📺 WATCH TRAVEL VIDEOS
          </a>
        </div>
      </div>
    </div>
  );
}