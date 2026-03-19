import { useState } from "react";
import { fetchWeather } from "../services/api";

// 1. Add setSelectedRecord to the props
export default function LocationInput({ reloadRecords, setSelectedRecord }) {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!location || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // 2. Capture the response from the API call
      const response = await fetchWeather({
        location_input: location,
        start_date: startDate,
        end_date: endDate,
      });

      // 3. THIS IS THE FIX: Push the new data to the display immediately
      if (response && response.data) {
        setSelectedRecord(response.data); 
      }

      setLocation(""); 
      setStartDate(""); 
      setEndDate(""); 
      reloadRecords(); 
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Backend error: Check uvicorn on port 8000");
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(`${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`);
      });
    } else alert("Geolocation not supported");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-center animate-in fade-in slide-in-from-top-4 duration-1000">
      
      {/* City/Zip Input - Glass Style */}
      <div className="relative flex-1 w-full max-w-sm">
        <input 
          type="text" 
          placeholder="Search for a city or airport" 
          className="glass-card w-full bg-white/5 border-none rounded-2xl px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all shadow-inner" 
          value={location} 
          onChange={e=>setLocation(e.target.value)} 
        />
      </div>

      {/* Date Range Group */}
      <div className="flex gap-2 w-full md:w-auto">
        <input 
          type="date" 
          className="glass-card bg-white/5 border-none rounded-2xl px-4 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 [color-scheme:dark]" 
          value={startDate} 
          onChange={e=>setStartDate(e.target.value)} 
        />
        <input 
          type="date" 
          className="glass-card bg-white/5 border-none rounded-2xl px-4 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 [color-scheme:dark]" 
          value={endDate} 
          onChange={e=>setEndDate(e.target.value)} 
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full md:w-auto">
        <button 
          className="flex-1 md:flex-none bg-purple-500 hover:bg-purple-400 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-purple-500/30 transition-all active:scale-95 disabled:opacity-50" 
          onClick={handleFetch}
          disabled={loading}
        >
          {loading ? "..." : "Fetch"}
        </button>
        
        <button 
          className="glass-card bg-white/10 hover:bg-white/20 text-white px-4 py-4 rounded-2xl transition-all active:scale-95" 
          onClick={useMyLocation}
          title="Use My Location"
        >
          📍
        </button>
      </div>
    </div>
  );
}