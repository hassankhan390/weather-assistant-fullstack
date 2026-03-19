import API from "../services/api";

export default function HistoryTable({ records, setSelectedRecord, reloadRecords }) {
  
  const handleDelete = async (id) => {
    try {
      await API.delete(`/records/${id}`);
      reloadRecords();
    } catch (err) {
      console.error(err);
    }
  };

  // NEW: Update functionality for the "Notes" field
  const handleUpdateNote = async (id, newNote) => {
    try {
      await API.put(`/records/${id}`, { notes: newNote });
      reloadRecords(); // Refresh to show the saved note
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="glass-card mt-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h3 className="text-sm font-bold uppercase tracking-widest text-purple-300 mb-6 opacity-80">
        Search History
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-white/40 text-[10px] uppercase tracking-widest">
              <th className="px-4 py-2 font-semibold">Location</th>
              <th className="px-4 py-2 font-semibold">Date</th>
              <th className="px-4 py-2 font-semibold">Notes (Update)</th>
              <th className="px-4 py-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr 
                key={r.id} 
                className="group bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-2xl"
              >
                {/* Location Clickable to View */}
                <td 
                  className="px-4 py-4 text-sm font-medium text-white cursor-pointer"
                  onClick={() => setSelectedRecord(r)}
                >
                  {r.location_input}
                </td>

                <td className="px-4 py-4 text-sm text-white/60">
                  {r.date_requested}
                </td>

                {/* UPDATE FIELD: Inline Note Input */}
                <td className="px-4 py-4">
                  <input 
                    type="text"
                    placeholder="Add a note..."
                    defaultValue={r.notes || ""}
                    onBlur={(e) => handleUpdateNote(r.id, e.target.value)}
                    className="bg-transparent border-b border-white/10 text-xs text-white/80 focus:border-purple-400 outline-none w-full pb-1 transition-colors"
                  />
                </td>

                {/* DELETE ACTION */}
                <td className="px-4 py-4 text-right">
                  <button 
                    className="opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300" 
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}