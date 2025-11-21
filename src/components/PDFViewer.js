import React from 'react';
import { X, Download } from 'lucide-react';

const PDFViewer = ({ isOpen, onClose, pdfUrl, title }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = title || 'paper.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl w-11/12 h-5/6 max-w-7xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <h2 className="text-xl font-bold text-white truncate">{title}</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDownload}
              className="btn-primary flex items-center space-x-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* PDF Content */}
        <div className="flex-grow p-4 bg-gray-800/50">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-lg border border-white/10"
              frameBorder="0"
              title="PDF Viewer"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-white/40 text-lg mb-2">Could not load PDF</div>
                <div className="text-white/60 text-sm">Please try downloading the file instead</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;