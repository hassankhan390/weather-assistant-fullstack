import API from "../services/api";

export default function HistoryTable({ records, setSelectedRecord, reloadRecords }) {
  
  const handleDelete = async (id) => {
    await API.delete(`/records/${id}`);
    reloadRecords();
  };

  const handleUpdateNote = async (id, newNote) => {
    if (newNote.length > 200) return alert("Note too long");
    await API.put(`/records/${id}`, { notes: newNote });
    reloadRecords();
  };

  const triggerExport = (format) => {
    window.open(`http://localhost:8000/export?format=${format}`, "_blank");
  };

  return (
    <div className="glass-card mt-12 p-8 rounded-[2rem]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h3 className="text-xs font-bold text-purple-300 uppercase tracking-widest">Search History</h3>
        
        {/* Requirement 2.3: Data Export */}
        <div className="flex gap-2 items-center">
          <span className="text-[9px] text-white/30 uppercase tracking-tighter">Export:</span>
          {['csv', 'json', 'markdown'].map(fmt => (
            <button key={fmt} onClick={() => triggerExport(fmt)} 
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] text-white/60 hover:bg-purple-500/30 uppercase transition-all">
              {fmt}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] text-white/40 uppercase tracking-widest">
              <th className="px-4">Location</th>
              <th className="px-4">Notes (Update)</th>
              <th className="px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} className="group bg-white/5 hover:bg-white/10 transition-all rounded-2xl">
                <td className="px-4 py-5 text-sm font-medium text-white cursor-pointer" onClick={() => setSelectedRecord(r)}>
                  {r.location_input}
                </td>
                {/* Requirement: Update functionality */}
                <td className="px-4 py-5">
                  <input type="text" defaultValue={r.notes} placeholder="Add a note..." 
                    onBlur={(e) => handleUpdateNote(r.id, e.target.value)}
                    className="bg-transparent border-b border-white/10 text-xs text-white/70 focus:border-purple-400 outline-none w-full" />
                </td>
                <td className="px-4 py-5 text-right">
                  <button onClick={() => handleDelete(r.id)} className="opacity-0 group-hover:opacity-100 text-red-400 text-[10px] font-bold uppercase transition-opacity">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}