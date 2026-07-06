function EmptyState({ title = "Data Kosong", message = "Belum ada data untuk ditampilkan.", icon: Icon }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-12 flex flex-col items-center justify-center text-center max-w-xl mx-auto shadow-sm my-6 font-sans">
      {Icon ? (
        <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-450">
          <Icon className="w-8 h-8" />
        </div>
      ) : null}
      <h3 className="text-sm font-bold text-slate-800 font-serif mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">{message}</p>
    </div>
  );
}

export default EmptyState;
