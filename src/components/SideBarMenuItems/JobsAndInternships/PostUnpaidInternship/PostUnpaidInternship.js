import React, { useState } from 'react';
import { 
  FiBriefcase, 
  FiUsers, 
  FiClock,
  FiMonitor,
  FiCode,
  FiAlertTriangle
} from 'react-icons/fi';
import { BiBuilding } from 'react-icons/bi';
import './PostUnpaidInternship.css';
import { toast } from 'react-toastify';
import { unpaidArmyService } from '../../../../api/services/unpaidArmyService';

const PostUnpaidInternship = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    internshipTitle: '',
    requiredSkills: '',
    positions: '',
    duration: '',
    workType: 'Virtual',
    employment: 'Part-Time',
    organization: 'Systemic Altruism'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only validate required fields for current step
    if (currentStep === 1) {
      if (!formData.internshipTitle?.trim() || !formData.requiredSkills?.trim()) {
        toast.error('Please fill in all required fields for Basic Information');
        return;
      }
      setCurrentStep(prev => prev + 1);
      return;
    }

    // Original validation for final submission
    if (currentStep === 3) {
      const validationErrors = [];
      if (!formData.internshipTitle?.trim()) validationErrors.push('Internship Title');
      if (!formData.requiredSkills?.trim()) validationErrors.push('Required Skills');
      if (!formData.positions) validationErrors.push('Positions');
      if (!formData.duration) validationErrors.push('Duration');

      if (validationErrors.length > 0) {
        toast.error(`Please fill in the following required fields: ${validationErrors.join(', ')}`);
        return;
      }

      // Rest of the submission logic
      try {
        const loadingToast = toast.loading('Posting unpaid internship...');
        console.log('Submitting form data:', formData); // Debug log
        
        await unpaidArmyService.postUnpaidInternship(formData);
        
        toast.update(loadingToast, {
          render: 'Unpaid internship posted successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });

        // Reset form
        setFormData({
          internshipTitle: '',
          requiredSkills: '',
          positions: '',
          duration: '',
          workType: 'Virtual',
          employment: 'Part-Time',
          organization: 'Systemic Altruism'
        });
        
        setCurrentStep(1);
      } catch (error) {
        console.error('Submission error:', error); // Debug log
        toast.error(error.message || 'Failed to post unpaid internship. Please try again.');
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderBasicInfo = () => (
    <div className="form-section">
      <h2 className="section-title">Basic Information</h2>
      
      <div className="field-group">
        <label className="field-label">
          <FiBriefcase className="field-icon" />
          Internship Title<span className="required">*</span>
        </label>
        <input
          type="text"
          name="internshipTitle"
          value={formData.internshipTitle}
          onChange={handleInputChange}
          placeholder="e.g., Software Development Intern"
          className="form-input"
          required
        />
      </div>

      <div className="field-group">
        <label className="field-label">
          <FiCode className="field-icon" />
          Required Skills<span className="required">*</span>
        </label>
        <input
          type="text"
          name="requiredSkills"
          value={formData.requiredSkills}
          onChange={handleInputChange}
          placeholder="e.g., React, Node.js, TypeScript"
          className="form-input"
          required
        />
        <small className="field-hint">Separate skills with commas</small>
      </div>

      <div className="flex-row">
        <div className="field-group half-width">
          <label className="field-label">
            <FiMonitor className="field-icon" />
            Work Type
          </label>
          <select
            name="workType"
            value={formData.workType}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="Virtual">Virtual</option>
            <option value="On-Site">On-Site</option>
          </select>
        </div>

        <div className="field-group half-width">
          <label className="field-label">
            <FiClock className="field-icon" />
            Employment
          </label>
          <select
            name="employment"
            value={formData.employment}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="Part-Time">Part-Time</option>
            <option value="Full-Time">Full-Time</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderInternshipDetails = () => (
    <div className="form-section">
      <h2 className="section-title">Internship Details</h2>
      
      <div className="flex-row">
        <div className="field-group half-width">
          <label className="field-label">
            <FiUsers className="field-icon" />
            Positions<span className="required">*</span>
          </label>
          <input
            type="number"
            name="positions"
            value={formData.positions}
            onChange={handleInputChange}
            placeholder="e.g., 5"
            className="form-input"
            min="1"
            required
          />
        </div>

        <div className="field-group half-width">
          <label className="field-label">
            <FiClock className="field-icon" />
            Duration<span className="required">*</span>
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Months"
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="important-note">
        <h3>
          <FiAlertTriangle className="note-icon" />Important Note
        </h3>
        <p>
          This is an unpaid internship opportunity. Ensure candidates understand there is no 
          monetary compensation, but they will gain valuable experience and mentorship.
        </p>
      </div>

      <div className="field-group">
        <label className="field-label">
          <BiBuilding className="field-icon" />
          Organization<span className="required">*</span>
        </label>
        <div className="form-input disabled">
          Systemic Altruism
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="form-section-card mb4">
      <div className="section-header">
        <h2 className="f3 fw6 mb3">Review Your Internship Posting</h2>
        <div className="section-divider"></div>
      </div>
      
      <div className="review-content">
        <div className="review-section mb4">
          <h3 className="f4 fw6 mb3">Basic Information</h3>
          <div className="review-item mb2">
            <span className="fw6">Internship Title:</span> {formData.internshipTitle}
          </div>
          <div className="review-item mb2">
            <span className="fw6">Required Skills:</span> {formData.requiredSkills}
          </div>
          <div className="review-item mb2">
            <span className="fw6">Work Type:</span> {formData.workType}
          </div>
          <div className="review-item mb2">
            <span className="fw6">Employment:</span> {formData.employment}
          </div>
        </div>

        <div className="review-section">
          <h3 className="f4 fw6 mb3">Internship Details</h3>
          <div className="review-item mb2">
            <span className="fw6">Positions:</span> {formData.positions}
          </div>
          <div className="review-item mb2">
            <span className="fw6">Duration:</span> {formData.duration} Months
          </div>
          <div className="review-item mb2">
            <span className="fw6">Organization:</span> {formData.organization}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="post-container">
      <div className="header">
        <div className="header-content">
          <div className="header-icon">
            <FiBriefcase />
          </div>
          <div className="header-text">
            <h1>Post Unpaid Internship</h1>
            <p>Create an unpaid internship posting to attract passionate volunteers.</p>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className={`step ${currentStep === 1 ? 'active' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <span className="step-number">1</span>
            <span className="step-text">Basic Info</span>
          </div>
          <div 
            className={`step ${currentStep === 2 ? 'active' : ''}`}
            onClick={() => setCurrentStep(2)}
          >
            <span className="step-number">2</span>
            <span className="step-text">Internship Details</span>
          </div>
          <div 
            className={`step ${currentStep === 3 ? 'active' : ''}`}
            onClick={() => setCurrentStep(3)}
          >
            <span className="step-number">3</span>
            <span className="step-text">Review</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderBasicInfo()}
        {currentStep === 2 && renderInternshipDetails()}
        {currentStep === 3 && renderReview()}

        <div className="form-actions">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="btn-secondary"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            className="btn-primary"
          >
            {currentStep === 3 ? 'Post Internship' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostUnpaidInternship;
