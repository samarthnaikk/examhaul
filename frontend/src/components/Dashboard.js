import React, { useState, useMemo } from 'react';
import { BookOpen, Users, TrendingUp, Star, Menu, X } from 'lucide-react';
import { SearchBar, FilterDropdown, PaperCard } from './PaperComponents';
import { dummyPapers, subjects, years, semesters, examTypes, difficulties } from '../utils/dummyData';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedExamType, setSelectedExamType] = useState('All Types');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredPapers = useMemo(() => {
    return dummyPapers.filter(paper => {
      const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSubject = selectedSubject === 'All Subjects' || paper.subject === selectedSubject;
      const matchesYear = selectedYear === 'All Years' || paper.year.toString() === selectedYear;
      const matchesSemester = selectedSemester === 'All Semesters' || paper.semester === selectedSemester;
      const matchesExamType = selectedExamType === 'All Types' || paper.examType === selectedExamType;
      const matchesDifficulty = selectedDifficulty === 'All Levels' || paper.difficulty === selectedDifficulty;

      return matchesSearch && matchesSubject && matchesYear && matchesSemester && matchesExamType && matchesDifficulty;
    });
  }, [searchTerm, selectedSubject, selectedYear, selectedSemester, selectedExamType, selectedDifficulty]);

  const stats = {
    totalPapers: dummyPapers.length,
    totalDownloads: dummyPapers.reduce((sum, paper) => sum + paper.downloadCount, 0),
    withSolutions: dummyPapers.filter(paper => paper.hasSolution).length,
    subjects: new Set(dummyPapers.map(paper => paper.subject)).size
  };

  return (
    <div className="min-h-screen bg-neon-gradient">
      {/* Header */}
      <header className="bg-hyper-indigo/90 backdrop-blur-sm border-b border-ghost-indigo/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-paper-smoke hover:text-cyber-lime transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-cyber-lime" />
                <h1 className="text-2xl font-bold text-paper-smoke">ExamHaul</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-soft-concrete text-sm">Total Papers</p>
                <p className="text-3xl font-bold text-hyper-indigo">{stats.totalPapers}</p>
              </div>
              <BookOpen className="w-8 h-8 text-electric-fuchsia" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-soft-concrete text-sm">Total Downloads</p>
                <p className="text-3xl font-bold text-hyper-indigo">{stats.totalDownloads.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-dusk-teal" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-soft-concrete text-sm">With Solutions</p>
                <p className="text-3xl font-bold text-hyper-indigo">{stats.withSolutions}</p>
              </div>
              <Star className="w-8 h-8 text-cyber-lime" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-soft-concrete text-sm">Subjects</p>
                <p className="text-3xl font-bold text-hyper-indigo">{stats.subjects}</p>
              </div>
              <Users className="w-8 h-8 text-warm-ultraviolet" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <FilterDropdown
              label="Subject"
              value={selectedSubject}
              onChange={setSelectedSubject}
              options={subjects}
            />
            <FilterDropdown
              label="Year"
              value={selectedYear}
              onChange={setSelectedYear}
              options={years}
            />
            <FilterDropdown
              label="Semester"
              value={selectedSemester}
              onChange={setSelectedSemester}
              options={semesters}
            />
            <FilterDropdown
              label="Exam Type"
              value={selectedExamType}
              onChange={setSelectedExamType}
              options={examTypes}
            />
            <FilterDropdown
              label="Difficulty"
              value={selectedDifficulty}
              onChange={setSelectedDifficulty}
              options={difficulties}
            />
          </div>
        </div>

        {/* Papers Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-paper-smoke mb-4">
            Past Papers ({filteredPapers.length} found)
          </h2>
          
          {filteredPapers.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="w-16 h-16 text-soft-concrete mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-soft-concrete mb-2">No papers found</h3>
              <p className="text-soft-concrete">
                Try adjusting your search criteria or filters to find more papers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;