import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Star, Menu, X } from 'lucide-react';
import { SearchBar, FilterDropdown, PaperCard } from './PaperComponents';
import { subjects } from '../utils/courseList';
// import backgroundImage from '../background.png';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
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
        throw new Error('Failed to fetch papers');
      }
      const data = await response.json();
      
      // Transform API data to match our component structure
      const transformedPapers = data.map((item, index) => {
        const urlParts = item.url.split('?');
        const cleanUrl = urlParts[0];
        const fileName = cleanUrl.split('/').pop();
        return {
          id: item.id,
          title: fileName.replace('.pdf', ''),
          subject: subject,
          year: new Date().getFullYear(), // Default to current year or extract from filename
          semester: 'General',
          examType: 'Past Paper',
          downloadCount: Math.floor(Math.random() * 1000), // Random for now
          hasSolution: Math.random() > 0.5, // Random for now
          tags: ['pdf', 'exam'],
          url: cleanUrl
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
    fetchPapers(subject);
  };

  const filteredPapers = useMemo(() => {
    return apiPapers.filter(paper => {
      const matchesSearch = !searchTerm || 
                           paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = selectedSubject === 'All Subjects' || paper.subject === selectedSubject;
      
      return matchesSearch && matchesSubject;
    });
  }, [searchTerm, apiPapers, selectedSubject]);

  const stats = {
    totalPapers: apiPapers.length,
    totalDownloads: apiPapers.reduce((sum, paper) => sum + paper.downloadCount, 0),
    withSolutions: apiPapers.filter(paper => paper.hasSolution).length,
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
        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            subjects={subjects}
            onSubjectSelect={handleSubjectSelect}
          />
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
              onChange={(value) => {
                setSelectedSubject(value);
                if (value !== 'All Subjects') {
                  handleSubjectSelect(value);
                } else {
                  setSearchTerm('');
                  setApiPapers([]);
                }
              }}
              options={subjects}
            />
            {/* Other filters can be re-enabled if needed */}
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
                    <div className="text-white/70 mb-6 text-lg">
                      {filteredPapers.length} papers found for "{searchTerm}"
                    </div>
                    
                    {filteredPapers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
