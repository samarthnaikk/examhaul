import React, { useEffect, useRef, useState } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import PDFViewer from './PDFViewer';

const rotatingPlaceholders = [
  "Search exam papers, subjects, or topics...",
  "Find past year questions instantly...",
  "Discover papers by subject or semester...",
  "Start typing to explore the archive...",
  "Search solved and unsolved papers..."
];

const SearchBar = ({ searchTerm, setSearchTerm, subjects, onSubjectSelect }) => {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const intervalRef = useRef();
  const typingRef = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Typing animation effect (slower)
  useEffect(() => {
    if (!searchTerm && !isFocused) {
      setTyped('');
      let charIdx = 0;
      const currentText = rotatingPlaceholders[placeholderIdx];
      typingRef.current = setInterval(() => {
        setTyped((prev) => {
          if (charIdx < currentText.length) {
            charIdx++;
            return currentText.slice(0, charIdx);
          } else {
            clearInterval(typingRef.current);
            return currentText;
          }
        });
      }, 80); // slower typing speed
    }
    return () => clearInterval(typingRef.current);
  }, [placeholderIdx, searchTerm, isFocused]);

  // Rotating placeholder every 5s
  useEffect(() => {
    if (!searchTerm && !isFocused) {
      intervalRef.current = setInterval(() => {
        setPlaceholderIdx((prev) => (prev + 1) % rotatingPlaceholders.length);
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [searchTerm, isFocused]);

  const filteredSubjects = subjects.filter(subject => 
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex-1 max-w-3xl mx-auto w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
        <Search className="text-white/70 w-6 h-6" />
      </span>
      <input
        type="text"
        placeholder={searchTerm || isFocused ? '' : typed}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => {
          setIsFocused(true);
          setShowSuggestions(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          // Delay hiding suggestions to allow click
          setTimeout(() => setShowSuggestions(false), 100);
        }}
        className="input-field w-full pl-14 pr-4 bg-transparent text-white placeholder-white/60"
        style={{ minHeight: '3.25rem' }}
      />
      {showSuggestions && searchTerm && filteredSubjects.length > 0 && (
        <ul className="absolute z-20 w-full bg-black/90 backdrop-blur-md border border-white/20 rounded-lg mt-2 max-h-60 overflow-y-auto shadow-2xl">
          {filteredSubjects.map(subject => (
            <li 
              key={subject}
              className="px-4 py-3 text-white hover:bg-cyber-lime/20 hover:text-cyber-lime cursor-pointer transition-all duration-200 border-b border-white/10 last:border-b-0"
              onMouseDown={() => {
                onSubjectSelect(subject);
                setShowSuggestions(false);
              }}
            >
              {subject}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FilterDropdown = ({ label, value, onChange, options }) => {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const PaperCard = ({ paper }) => {
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);

  return (
    <>
      <div className="card hover:scale-105 transform transition-all duration-300 w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{paper.title}</h3>
            <p className="text-dusk-teal font-semibold text-lg">{paper.subject}</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge-secondary">{paper.year}</span>
          <span className="badge-secondary">{paper.semester}</span>
          <span className="badge-secondary">{paper.examType}</span>
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={() => setIsPDFViewerOpen(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <span>View Paper</span>
          </button>
        </div>
      </div>
      
      <PDFViewer
        isOpen={isPDFViewerOpen}
        onClose={() => setIsPDFViewerOpen(false)}
        pdfUrl={paper.url}
        title={paper.title}
      />
    </>
  );
};

export { SearchBar, FilterDropdown, PaperCard };
