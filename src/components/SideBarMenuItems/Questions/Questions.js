import React, { useState, useCallback, useEffect } from 'react';
import './Questions.css';
import { activeListingService } from '../../../api/services/activeListingService';
import { questionsService } from '../../../api/services/questionsService';
import { toast } from 'react-toastify';
import { replyService } from '../../../api/services/replyService';

const Questions = () => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [activeListings, setActiveListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0
  });
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    fetchActiveListings();
  }, []);

  // Fetch questions when listing is selected or page changes
  useEffect(() => {
    if (selectedListing) {
      fetchQuestions();
    }
  }, [selectedListing, currentPage]);

  const fetchActiveListings = async () => {
    try {
      setIsLoading(true);
      const listings = await activeListingService.getActiveListings();
      setActiveListings(listings.map(listing => ({
        id: listing.id,
        name: listing.projectName
      })));
    } catch (error) {
      toast.error(error.message || 'Failed to fetch active listings');
      setActiveListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      setIsLoadingQuestions(true);
      const offset = (currentPage - 1) * 10; // 10 items per page

      const response = await questionsService.getQuestions(
        selectedListing,
        offset,
        10
      );

      if (response.success) {
        const formattedQuestions = response.data.questions.map(q => ({
          id: q.message_id,
          author: q.name,
          content: q.question,
          date: new Date(q.time_stamp).toLocaleString(),
          listingId: selectedListing
        }));

        setQuestionsList(formattedQuestions);
        setPagination({
          totalPages: response.data.pagination.total_pages,
          totalCount: response.data.pagination.total_count
        });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch questions');
      setQuestionsList([]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Filter questions based on selected listing and search query
  const filteredQuestions = questionsList.filter(question => {
    const matchesListing = selectedListing ? question.listingId === selectedListing : true;
    const matchesSearch = searchQuery.trim() === '' ? true : 
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesListing && matchesSearch;
  });

  // Handle search input change
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    // Reset the questions list to original data
    setQuestionsList([...questionsList]);
    // Optionally clear search and selection
    setSearchQuery('');
  }, []);

  const handleReplyClick = (questionId) => {
    setReplyingTo(replyingTo === questionId ? null : questionId);
  };

  const handleReplySubmit = async (question, event) => {
    event.preventDefault();
    const replyText = event.target.reply.value.trim();

    if (!replyText) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      setIsSubmittingReply(true);
      const loadingToast = toast.loading('Sending reply...');

      await replyService.replyToQuestion(
        selectedListing,
        question.chatId,
        question.id,
        replyText
      );

      toast.update(loadingToast, {
        render: 'Reply sent successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setReplyingTo(null); // Close reply form
      event.target.reset(); // Clear form
      
      // Optionally refresh questions list
      fetchQuestions();
    } catch (error) {
      toast.error(error.message || 'Failed to send reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="questions-dashboard">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Questions Dashboard</h1>
          <span className="question-count">{filteredQuestions.length} Questions</span>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input 
              type="search" 
              placeholder="Search questions..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="active-listings">
          <h2>Active Listings</h2>
          <div className="listings-scroll">
            {activeListings.map((listing) => (
              <div 
                key={listing.id} 
                className={`listing-item ${selectedListing === listing.id ? 'selected' : ''}`}
                onClick={() => setSelectedListing(listing.id)}
              >
                <div className="listing-info">
                  <span className="listing-name">{listing.name}</span>
                  <span className="listing-role">Role not specified</span>
                </div>
                <div className="question-badge">
                  {/* Add question count if available */}
                  {questionsList.filter(q => q.listingId === listing.id).length} Questions
                </div>
              </div>
            ))}
            {activeListings.length === 0 && (
              <div className="no-listings">
                {searchQuery 
                  ? `No listings found matching "${searchQuery}"`
                  : 'No active listings found'}
              </div>
            )}
          </div>
        </aside>

        <main className="questions-container">
          {isLoadingQuestions ? (
            <div className="loading-state">Loading questions...</div>
          ) : (
            <>
              {filteredQuestions.map((question) => (
                <div key={question.id} className="question-card">
                  <div className="question-header">
                    <div className="author-info">
                      <div className="author-avatar">{question.author[0]}</div>
                      <div className="question-meta">
                        <h3>{question.author}</h3>
                        <time>{question.date}</time>
                      </div>
                    </div>
                    <div className="question-id">ID: {question.id}</div>
                  </div>
                  <div className="question-content">{question.content}</div>
                  <div className="question-actions">
                    <button 
                      className="reply-button"
                      onClick={() => handleReplyClick(question.id)}
                      disabled={isSubmittingReply}
                    >
                      Reply
                    </button>
                  </div>
                  {replyingTo === question.id && (
                    <div className="reply-field-container">
                      <form onSubmit={(e) => handleReplySubmit(question, e)}>
                        <textarea 
                          name="reply"
                          className="reply-textarea"
                          placeholder="Write your reply..."
                          required
                          disabled={isSubmittingReply}
                        />
                        <div className="reply-actions">
                          <button 
                            type="button" 
                            onClick={() => setReplyingTo(null)}
                            className="cancel-btn"
                            disabled={isSubmittingReply}
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmittingReply}
                          >
                            {isSubmittingReply ? 'Sending...' : 'Send'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              ))}
              {filteredQuestions.length === 0 && (
                <div className="no-questions">
                  {selectedListing ? 'No questions found for this listing' : 'Select a listing to view questions'}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Questions;
