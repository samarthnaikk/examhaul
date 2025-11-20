import React from 'react';
import { Search, Filter, Download, CheckCircle, XCircle } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite-black/60 w-5 h-5" />
      <input
        type="text"
        placeholder="Search papers, subjects, topics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input-field w-full pl-10 pr-4"
      />
    </div>
  );
};

const FilterDropdown = ({ label, value, onChange, options }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field pr-8 appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-graphite-black/60 w-4 h-4 pointer-events-none" />
    </div>
  );
};

const PaperCard = ({ paper }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-cyber-lime text-graphite-black';
      case 'Medium': return 'bg-dusk-teal text-paper-smoke';
      case 'Hard': return 'bg-electric-fuchsia text-paper-smoke';
      default: return 'bg-soft-concrete text-graphite-black';
    }
  };

  return (
    <div className="card hover:scale-105 transform transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-graphite-black mb-2">{paper.title}</h3>
          <p className="text-warm-ultraviolet font-semibold text-lg">{paper.subject}</p>
        </div>
        <div className="flex items-center space-x-2">
          {paper.hasSolution ? (
            <CheckCircle className="w-6 h-6 text-cyber-lime" />
          ) : (
            <XCircle className="w-6 h-6 text-soft-concrete" />
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="badge-secondary">{paper.year}</span>
        <span className="badge-secondary">{paper.semester}</span>
        <span className="badge-secondary">{paper.examType}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(paper.difficulty)}`}>
          {paper.difficulty}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {paper.tags.map((tag) => (
          <span key={tag} className="bg-hyper-indigo/10 text-hyper-indigo px-2 py-1 rounded text-xs">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-graphite-black/70">
          <p>{paper.downloadCount} downloads</p>
          <p>Uploaded: {new Date(paper.uploadDate).toLocaleDateString()}</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export { SearchBar, FilterDropdown, PaperCard };