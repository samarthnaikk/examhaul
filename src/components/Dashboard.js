import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Star, Menu, X } from 'lucide-react';
import { SearchBar, FilterDropdown, PaperCard } from './PaperComponents';
import { dummyPapers, subjects, years, semesters, examTypes } from '../utils/dummyData';
// import backgroundImage from '../background.png';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedExamType, setSelectedExamType] = useState('All Types');
  // const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiPapers, setApiPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch papers from API
  const fetchPapers = async (query) => {
    if (!query.trim()) {
      setApiPapers([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://examhaul-backend.vercel.app/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch papers');
      }
      const data = await response.json();
      
      // Transform API data to match our component structure
      const transformedPapers = data.map((item, index) => ({
        id: item.id,
        title: `Paper ${item.id}`,
        subject: 'General', // You might want to extract this from filename or add to API
        year: new Date().getFullYear(), // Default to current year or extract from filename
        semester: 'General',
        examType: 'Past Paper',
        downloadCount: Math.floor(Math.random() * 1000), // Random for now
        hasSolution: Math.random() > 0.5, // Random for now
        tags: ['pdf', 'exam'],
        url: item.url
      }));
      
      setApiPapers(transformedPapers);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching papers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced API call when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchPapers(searchTerm);
      } else {
        setApiPapers([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredPapers = useMemo(() => {
    // Use API papers if available and search term exists, otherwise use dummy data
    const papersToFilter = searchTerm && apiPapers.length > 0 ? apiPapers : dummyPapers;
    
    return papersToFilter.filter(paper => {
      const matchesSearch = !searchTerm || 
                           paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSubject = selectedSubject === 'All Subjects' || paper.subject === selectedSubject;
      const matchesYear = selectedYear === 'All Years' || paper.year.toString() === selectedYear;
      const matchesSemester = selectedSemester === 'All Semesters' || paper.semester === selectedSemester;
      const matchesExamType = selectedExamType === 'All Types' || paper.examType === selectedExamType;
      // const matchesDifficulty = selectedDifficulty === 'All Levels' || paper.difficulty === selectedDifficulty;

      return matchesSearch && matchesSubject && matchesYear && matchesSemester && matchesExamType;
    });
  }, [searchTerm, apiPapers, selectedSubject, selectedYear, selectedSemester, selectedExamType]);

  const stats = {
    totalPapers: dummyPapers.length,
    totalDownloads: dummyPapers.reduce((sum, paper) => sum + paper.downloadCount, 0),
    withSolutions: dummyPapers.filter(paper => paper.hasSolution).length,
    subjects: new Set(dummyPapers.map(paper => paper.subject)).size
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
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
            {/* Search bar removed from header */}
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
                <p className="text-white/70 text-sm">Total Papers</p>
                <p className="text-3xl font-bold text-white">{stats.totalPapers}</p>
              </div>
              <BookOpen className="w-8 h-8 text-electric-fuchsia" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Downloads</p>
                <p className="text-3xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-dusk-teal" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">With Solutions</p>
                <p className="text-3xl font-bold text-white">{stats.withSolutions}</p>
              </div>
              <Star className="w-8 h-8 text-cyber-lime" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Subjects</p>
                <p className="text-3xl font-bold text-white">{stats.subjects}</p>
              </div>
              <Users className="w-8 h-8 text-dusk-teal" />
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

          </div>
        </div>

        {/* Centered Search Section */}
        <div className="flex items-center justify-center py-16">
          <div className="w-full max-w-4xl text-center">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Find Your Papers
              </h2>
              {/* Subtitle removed as placeholder now rotates in the search bar */}
            </div>
            
            <div className="w-full max-w-5xl mx-auto mt-4">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            
            {searchTerm && (
              <div className="mt-8">
                {loading ? (
                  <div className="text-white/70 mb-6 text-lg text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    Searching papers...
                  </div>
                ) : error ? (
                  <div className="card py-8 border-red-500/20 bg-red-500/10">
                    <p className="text-red-400 text-center">
                      Error: {error}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-white/70 mb-6 text-lg">
                      {filteredPapers.length} papers found for "{searchTerm}"
                      {apiPapers.length > 0 && (
                        <span className="text-cyber-lime text-sm ml-2">(from API)</span>
                      )}
                    </div>
                    
                    {filteredPapers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
                        {filteredPapers.slice(0, 6).map((paper) => (
                          <PaperCard key={paper.id} paper={paper} />
                        ))}
                        {filteredPapers.length > 6 && (
                          <div className="col-span-full text-white/60 text-sm mt-4">
                            Showing first 6 results. Refine your search for more specific results.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="card py-8">
                        <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/70">
                          No papers found. Try a different search term.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;