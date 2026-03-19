import { useState, useEffect } from "react";
import LocationInput from "./components/LocationInput";
import WeatherCard from "./components/WeatherCard";
import ForecastGrid from "./components/ForecastGrid";
import HistoryTable from "./components/HistoryTable";
import Footer from "./components/Footer";
import API from "./services/api";

function App() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const res = await API.get("/records");
      setRecords(res.data);
      // Auto-select the most recent search to show on the dashboard
      if (res.data.length > 0 && !selectedRecord) {
        setSelectedRecord(res.data[0]);
      }
    } catch (err) {
      console.error("Load Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-500/30">
      
      {/* 1. Header: Transparent & Elegant */}
      <header className="py-8 text-center animate-in fade-in zoom-in duration-700">
        <h1 className="text-2xl font-extralight tracking-[0.3em] text-white uppercase opacity-90">
          PM Accelerator
        </h1>
        <p className="text-[10px] tracking-[0.5em] text-purple-400 font-bold uppercase mt-1">
          Smart Weather Assistant
        </p>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pb-20">
        
        {/* Input Section */}
        <section className="mb-12">
          <LocationInput reloadRecords={loadRecords} setSelectedRecord={setSelectedRecord} />
        </section>

        {/* Current Weather & Forecast Section */}
        <section className="space-y-12">
          {selectedRecord ? (
            <>
              <WeatherCard record={selectedRecord} />
              <ForecastGrid record={selectedRecord} />
            </>
          ) : (
            <div className="glass-card p-20 text-center rounded-[3rem]">
              <p className="text-white/20 italic tracking-widest">
                Search a location to begin...
              </p>
            </div>
          )}
        </section>

        {/* History Table Section */}
        <section className="mt-20">
          <HistoryTable 
            records={records} 
            setSelectedRecord={setSelectedRecord} 
            reloadRecords={loadRecords} 
          />
        </section>
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}

export default App;