import React, { useState } from 'react';
import './Questions.css';
import QuestionsActiveListings from './QuestionsActiveListings';
import QuestionsCard from './QuestionsCard';
import { activeListings } from './activeListingsData';
import { questions } from './questionsData';

const Questions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState(activeListings[0].id);

  const filteredQuestions = questions.filter(question => {
    const title = question.title || '';
    const description = question.description || '';
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const questionsForSelectedListing = filteredQuestions.filter(
    question => question.listingId === selectedListing
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleListingSelect = (listingId) => {
    setSelectedListing(listingId);
  };

  const selectedListingDetails = activeListings.find(listing => listing.id === selectedListing);
  const questionsCount = questionsForSelectedListing.length;

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
              onClick={() => console.log('Refresh clicked')}
            >
              Refresh
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
            listings={activeListings}
          />
        </div>

        <div className="w-75 pl4">
          <div className="questions-grid">
            {questionsForSelectedListing.map(question => (
              <QuestionsCard 
                key={question.id}
                question={question}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
