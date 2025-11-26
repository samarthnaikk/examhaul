import React, { useState, useMemo } from 'react';
import { BookOpen, Users, TrendingUp, Star, Menu, X } from 'lucide-react';
import { SearchBar, FilterDropdown, PaperCard } from './PaperComponents';
import { subjects } from '../utils/courseList';
// import backgroundImage from '../background.png';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedSlot, setSelectedSlot] = useState('All Slots');
  const [selectedExamType, setSelectedExamType] = useState('All Types');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiPapers, setApiPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch papers from API
  const fetchPapers = async (subject) => {
    if (!subject || subject === 'All Subjects') {
      setApiPapers([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://examhaul-backend.vercel.app/search?q=${encodeURIComponent(subject)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch papers: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform API data to match our component structure
      const transformedPapers = data.map((item, index) => {
        // Generate a more descriptive title
        const examType = item.exam || 'Paper';
        const year = item.year || new Date().getFullYear();
        const slot = item.slot ? ` - Slot ${item.slot}` : '';
        const title = `${examType} ${year}${slot}`;
        
        return {
          id: item.id || `paper_${index}`,
          title: title,
          subject: item.subject || subject,
          year: item.year || new Date().getFullYear(),
          semester: item.sem || 'General',
          examType: item.exam || 'Past Paper',
          slot: item.slot || null,
          downloadCount: Math.floor(Math.random() * 1000), // Random for now
          hasSolution: true, // All papers have solutions
          tags: ['pdf', 'exam'],
          url: item.url
        };
      });
      
      setApiPapers(transformedPapers);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subject) => {
    setSearchTerm(subject);
    setSelectedSubject(subject);
    setSelectedYear('All Years');
    setSelectedSlot('All Slots');
    setSelectedExamType('All Types');
    fetchPapers(subject);
  };

  const filteredPapers = useMemo(() => {
    let filtered = apiPapers;
    if (selectedYear !== 'All Years') {
      filtered = filtered.filter(paper => String(paper.year) === String(selectedYear));
    }
    if (selectedSlot !== 'All Slots') {
      filtered = filtered.filter(paper => String(paper.slot) === String(selectedSlot));
    }
    if (selectedExamType !== 'All Types') {
      filtered = filtered.filter(paper => String(paper.examType) === String(selectedExamType));
    }
    return filtered;
  }, [apiPapers, selectedYear, selectedSlot, selectedExamType]);

  const stats = {
    totalPapers: apiPapers.length,
    totalDownloads: apiPapers.reduce((sum, paper) => sum + paper.downloadCount, 0),
    withSolutions: apiPapers.length, // All papers have solutions
    subjects: new Set(apiPapers.map(paper => paper.subject)).size
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
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center">
              <FilterDropdown
                label="Subject"
                value={selectedSubject}
                onChange={(value) => {
                  setSelectedSubject(value);
                  setSelectedYear('All Years');
                  setSelectedSlot('All Slots');
                  setSelectedExamType('All Types');
                  fetchPapers(value);
                }}
                options={subjects}
              />
            </div>
            <div className="flex items-center gap-4">
              <FilterDropdown
                label="Exam Type"
                value={selectedExamType}
                onChange={setSelectedExamType}
                options={["All Types", ...Array.from(new Set(apiPapers.map(paper => paper.examType).filter(Boolean)))]}
              />
              <FilterDropdown
                label="Slot"
                value={selectedSlot}
                onChange={setSelectedSlot}
                options={["All Slots", ...Array.from(new Set(apiPapers.map(paper => paper.slot).filter(Boolean)))]}
              />
              <FilterDropdown
                label="Year"
                value={selectedYear}
                onChange={setSelectedYear}
                options={["All Years", ...Array.from(new Set(apiPapers.map(paper => paper.year))).sort((a, b) => b - a)]}
              />
            </div>
          </div>
        </div>

        {/* Centered Search Section */}
        <div className="flex items-center justify-center py-16">
          <div className="w-full max-w-7xl text-center">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Find Your Papers
              </h2>
              {/* Subtitle removed as placeholder now rotates in the search bar */}
            </div>
            
            <div className="w-full max-w-5xl mx-auto mt-4">
              <SearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm}
                subjects={subjects}
                onSubjectSelect={handleSubjectSelect}
              />
            </div>
            
            {searchTerm && !loading && (
              <div className="mt-8">
                {error ? (
                  <div className="card py-8">
                    <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/70">
                      No papers found. Try a different search term or select a subject.
                    </p>
                  </div>
                ) : (
                  <>
                    {filteredPapers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredPapers.map((paper) => (
                          <PaperCard key={paper.id} paper={paper} />
                        ))}
                      </div>
                    ) : (
                      <div className="card py-8">
                        <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/70">
                          No papers found. Try a different search term or select a subject.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {loading && (
              <div className="mt-8">
                <div className="text-white/70 mb-6 text-lg text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  Searching papers...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
