import React, { useEffect, useRef, useState } from 'react';
import { Search, Download, CheckCircle, XCircle } from 'lucide-react';

const rotatingPlaceholders = [
  "Search through VIT Vellore's past papers archive",
  "Search papers, subjects, topics...",
  "Find exam questions, solutions, and more",
  "Type a keyword to get started",
  "Explore previous year papers by subject or year"
];

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [typing, setTyping] = useState(true);
  const intervalRef = useRef();
  const typingRef = useRef();

  // Typing animation effect
  useEffect(() => {
    if (!searchTerm) {
      setTyped('');
      setTyping(true);
      let charIdx = 0;
      const currentText = rotatingPlaceholders[placeholderIdx];
      typingRef.current = setInterval(() => {
        setTyped((prev) => {
          if (charIdx < currentText.length) {
            charIdx++;
            return currentText.slice(0, charIdx);
          } else {
            clearInterval(typingRef.current);
            setTyping(false);
            return currentText;
          }
        });
      }, 40); // typing speed
    }
    return () => clearInterval(typingRef.current);
  }, [placeholderIdx, searchTerm]);

  // Rotating placeholder every 5s
  useEffect(() => {
    if (!searchTerm) {
      intervalRef.current = setInterval(() => {
        setPlaceholderIdx((prev) => (prev + 1) % rotatingPlaceholders.length);
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [searchTerm]);

  return (
    <div className="relative flex-1 max-w-3xl mx-auto w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
      <input
        type="text"
        placeholder={searchTerm ? '' : typed}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input-field w-full pl-10 pr-4"
      />
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

  return (
    <div className="card hover:scale-105 transform transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{paper.title}</h3>
          <p className="text-dusk-teal font-semibold text-lg">{paper.subject}</p>
        </div>
        <div className="flex items-center space-x-2">
          {paper.hasSolution ? (
            <CheckCircle className="w-6 h-6 text-green-700" />
          ) : (
            <XCircle className="w-6 h-6 text-soft-concrete" />
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="badge-secondary">{paper.year}</span>
        <span className="badge-secondary">{paper.semester}</span>
        <span className="badge-secondary">{paper.examType}</span>
      </div>

      <div className="flex justify-between items-center">
        <button className="btn-secondary flex items-center space-x-2">
          <span>View Paper</span>
        </button>
        <button className="btn-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export { SearchBar, FilterDropdown, PaperCard };