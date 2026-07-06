import { X } from 'lucide-react';

function FormModal({ isOpen, onClose, title, children, maxWidthClass = "max-w-2xl" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div className={`bg-white rounded-2xl w-full ${maxWidthClass} overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col max-h-[90vh]`}>
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="text-sm sm:text-base font-bold font-serif text-slate-900">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
}

export default FormModal;
