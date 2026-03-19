export default function Footer() {
  return (
    <footer className="mt-auto py-10 px-6 animate-in fade-in duration-1000">
      {/* Subtle Divider Line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>
      
      <div className="flex flex-col items-center gap-2">
        {/* Brand Name */}
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400 opacity-80">
          PM Accelerator
        </span>
        
        {/* Mission Statement - Delicate & Centered */}
        <p className="max-w-md text-[13px] leading-relaxed text-white/40 font-light italic">
          "Helping aspiring Product Managers accelerate their careers through tech, strategy & practical projects."
        </p>
        
        {/* Copyright/Year Info */}
        <span className="text-[10px] text-white/20 mt-4 tracking-widest">
          © 2026 AI ENGINEER INTERN ASSESSMENT
        </span>
      </div>
    </footer>
  );
}