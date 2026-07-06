import { Loader2 } from 'lucide-react';

function LoadingState({ message = "Memuat data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-slate-400 font-sans">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3.5" />
      <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400/90">{message}</p>
    </div>
  );
}

export default LoadingState;
