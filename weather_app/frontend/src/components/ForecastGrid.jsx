export default function ForecastGrid({ record }) {
  if (!record) return null;

  return (
    <div className="flex flex-nowrap md:justify-center gap-4 overflow-x-auto pb-8 pt-4 no-scrollbar">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className="glass-card flex flex-col items-center py-8 px-6 rounded-full min-w-[110px] transition-all duration-300 hover:scale-105 hover:bg-white/15"
        >
          {/* Day Label - Delicate & Small */}
          <span className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase mb-3">
            Day {i}
          </span>
          
          {/* Weather Icon Placeholder - Using a simple emoji to match 3D vibe */}
          <span className="text-3xl mb-4 drop-shadow-lg">
            {record.condition.includes("cloud") ? "☁️" : "☀️"}
          </span>
          
          {/* Temperature - Bold & Clear */}
          <span className="text-2xl font-light text-white">
            {Math.round(record.temp + i)}°
          </span>
          
          {/* Condition - Subtle & Tiny */}
          <span className="text-[10px] text-white/50 capitalize mt-2 text-center leading-tight">
            {record.condition}
          </span>
        </div>
      ))}
    </div>
  );
}