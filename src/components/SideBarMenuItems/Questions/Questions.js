import React, { useState, useEffect } from 'react';
import './Questions.css';
import QuestionsActiveListings from './QuestionsActiveListings';
import QuestionsCard from './QuestionsCard';
import { activeListingService } from '../../../api/services/activeListingService';
import { questionService } from '../../../api/services/questionService';
import { toast } from 'react-toastify';

const Questions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [listings, setListings] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const LIMIT = 10;

  const filteredQuestions = questions.filter(question => {
    const content = question.content || '';
    return content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleListingSelect = (listingId) => {
    setSelectedListing(listingId);
    setPage(0); // Reset pagination when changing listings
    setQuestions([]); // Clear existing questions
  };

  const fetchQuestions = async () => {
    if (!selectedListing) return;
    
    try {
      setIsLoading(true);
      const fetchedQuestions = await questionService.getQuestions({
        listing: selectedListing,
        offset: page * LIMIT,
        limit: LIMIT
      });
      
      setQuestions(prev => 
        page === 0 ? fetchedQuestions : [...prev, ...fetchedQuestions]
      );
    } catch (error) {
      toast.error('Failed to fetch questions');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setPage(0);
    fetchQuestions();
  };

  // Fetch active listings on mount
  useEffect(() => {
    const fetchActiveListings = async () => {
      try {
        const fetchedListings = await activeListingService.getActiveListingsForQuestions();
        setListings(fetchedListings);
        if (!selectedListing && fetchedListings.length > 0) {
          setSelectedListing(fetchedListings[0].id);
        }
      } catch (error) {
        toast.error('Failed to fetch active listings');
        console.error('Error:', error);
      }
    };

    fetchActiveListings();
  }, []);

  // Fetch questions when selected listing changes
  useEffect(() => {
    if (selectedListing) {
      fetchQuestions();
    }
  }, [selectedListing, page]);

  const selectedListingDetails = listings.find(listing => listing.id === selectedListing);
  const questionsCount = filteredQuestions.length;

  return (
    <div className="pa4">
      <div className="mb4">
        <div className="flex justify-between items-center mb3">
          <div className="flex items-center">
            <h1 className="f1 fw6 mv0">Questions Dashboard</h1>
            <span className="ml3 f6 bg-light-blue blue br2 ph3 pv1">
              {questionsCount} Questions
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="search"
              placeholder="Search questions..."
              className="pa2 br2 ba b--light-gray mr3"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button 
              className="action-button f6 link dim br2 ph3 pv2 dib white bg-blue bn"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        {selectedListingDetails && (
          <div className="flex items-center gray mt2">
            <span className="f4 fw5 dark-gray">{selectedListingDetails.name}</span>
            <span className="mh2 f6">•</span>
            <span className="f5 moon-gray">#{selectedListingDetails.id}</span>
          </div>
        )}
      </div>

      <div className="flex">
        <div className="w-25">
          <QuestionsActiveListings 
            selectedListing={selectedListing}
            onListingSelect={handleListingSelect}
            listings={listings}
          />
        </div>

        <div className="w-75 pl4">
          <div className="questions-grid">
            {filteredQuestions.map(question => (
              <QuestionsCard 
                key={question.id}
                question={question}
              />
            ))}
            {isLoading && (
              <div className="tc pa4">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
