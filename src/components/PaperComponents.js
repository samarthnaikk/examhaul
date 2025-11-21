import React, { useEffect, useRef, useState } from 'react';
import { Search, Download, CheckCircle, XCircle } from 'lucide-react';
import Modal from './Modal';

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
        <ul className="absolute z-20 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 max-h-60 overflow-y-auto">
          {filteredSubjects.map(subject => (
            <li 
              key={subject}
              className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = () => {
    if (paper.url) {
      const link = document.createElement('a');
      link.href = paper.url;
      link.download = paper.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div className="card hover:scale-105 transform transition-all duration-300 w-full">
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <span>View Paper</span>
          </button>
          <button 
            onClick={handleDownload}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {paper.url ? (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(paper.url)}&embedded=true`}
            className="w-full h-full"
            frameBorder="0"
            title="Paper Preview"
          ></iframe>
        ) : (
          <div className="text-white">Could not load paper preview.</div>
        )}
      </Modal>
    </>
  );
};

export { SearchBar, FilterDropdown, PaperCard };
