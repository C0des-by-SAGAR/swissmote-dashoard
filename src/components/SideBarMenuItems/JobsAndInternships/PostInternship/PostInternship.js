import React, { useState } from 'react';
import { 
  FiBriefcase, 
  FiUsers, 
  FiClock,
  FiMonitor,
  FiCalendar
} from 'react-icons/fi';
import { BiBuilding, BiRupee } from 'react-icons/bi';
import './PostInternship.css';
import { toast } from 'react-toastify';
import { internshipService } from '../../../../api/services/internshipService';

const organizationMap = {
  'org1': 'Persist Ventures',
  'org2': 'Systemic Altruism'
};

const PostInternship = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    internshipTitle: '',
    requiredSkills: '',
    positions: '',
    duration: '',
    stipend: '',
    workType: 'Virtual',
    employment: 'Part-Time',
    organization: ''
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
    
    if (currentStep !== 3) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    // Validate required fields
    if (!formData.internshipTitle || 
        !formData.requiredSkills || 
        !formData.positions || 
        !formData.duration || 
        !formData.stipend || 
        !formData.organization) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const loadingToast = toast.loading('Posting internship...');
      
      await internshipService.postInternship(formData);
      
      toast.update(loadingToast, {
        render: 'Internship posted successfully!',
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
        stipend: '',
        workType: 'Virtual',
        employment: 'Part-Time',
        organization: ''
      });
      
      setCurrentStep(1);
    } catch (error) {
      toast.error(error.message || 'Failed to post internship. Please try again.');
    }
  };

  const handleStepClick = (step) => {
    setCurrentStep(step);
  };

  const renderBasicInfo = () => (
    <div className="form-section-card mb4">
      <div className="section-header">
        <h2 className="f3 fw6 mb3">Basic Information</h2>
        <div className="section-divider"></div>
      </div>
      
      <div className="field-group mb4">
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
          className="modern-input"
          required
        />
      </div>

      <div className="field-group mb4">
        <label className="field-label">
          <FiUsers className="field-icon" />
          Required Skills<span className="required">*</span>
        </label>
        <input
          type="text"
          name="requiredSkills"
          value={formData.requiredSkills}
          onChange={handleInputChange}
          placeholder="e.g., React, Node.js, TypeScript"
          className="modern-input"
          required
        />
        <small className="field-hint">Separate skills with commas</small>
      </div>

      <div className="flex flex-wrap">
        <div className="w-50-l w-100 pr3-l mb3">
          <label className="field-label">
            <FiMonitor className="field-icon" />
            Work Type
          </label>
          <select
            name="workType"
            value={formData.workType}
            onChange={handleInputChange}
            className="modern-select"
          >
            <option value="Virtual">Virtual</option>
            <option value="On-Site">On-Site</option>
          </select>
        </div>

        <div className="w-50-l w-100 mb3">
          <label className="field-label">
            <FiClock className="field-icon" />
            Employment
          </label>
          <select
            name="employment"
            value={formData.employment}
            onChange={handleInputChange}
            className="modern-select"
          >
            <option value="Part-Time">Part-Time</option>
            <option value="Full-Time">Full-Time</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderInternshipDetails = () => (
    <div className="form-section-card mb4">
      <div className="section-header">
        <h2 className="f3 fw6 mb3">Internship Details</h2>
        <div className="section-divider"></div>
      </div>
      
      <div className="flex flex-wrap">
        <div className="w-third-l w-100 pr3-l mb4">
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
            className="modern-input"
            min="1"
            required
          />
        </div>

        <div className="w-third-l w-100 pr3-l mb4">
          <label className="field-label">
            <FiCalendar className="field-icon" />
            Duration<span className="required">*</span>
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Months"
            className="modern-input"
            required
          />
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="w-third-l w-100 pr3-l mb4">
          <label className="field-label">
            <BiRupee className="field-icon" />
            Stipend<span className="required">*</span>
          </label>
          <input
            type="text"
            name="stipend"
            value={formData.stipend}
            onChange={handleInputChange}
            placeholder="Min ₹8,000"
            className="modern-input"
            required
          />
        </div>
      </div>

      <div className="w-100 mb3">
        <label className="field-label">
          <BiBuilding className="field-icon" />
          Organization<span className="required">*</span>
        </label>
        <select
          name="organization"
          value={formData.organization}
          onChange={handleInputChange}
          className="modern-select"
          required
        >
          <option value="">Select an Organization</option>
          <option value="org1">Persist Ventures</option>
          <option value="org2">Systemic Altruism</option>
        </select>
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
            <span className="fw6">Stipend:</span> ₹{formData.stipend}
          </div>
          <div className="review-item mb2">
            <span className="fw6">Organization:</span> {organizationMap[formData.organization] || formData.organization}
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
            <h1>Post Internship</h1>
            <p>Create an internship posting to attract talented individuals for your organization.</p>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className={`step ${currentStep === 1 ? 'active' : ''}`}
            onClick={() => handleStepClick(1)}
          >
            <span className="step-number">1</span>
            <span className="step-text">Basic Info</span>
          </div>
          <div 
            className={`step ${currentStep === 2 ? 'active' : ''}`}
            onClick={() => handleStepClick(2)}
          >
            <span className="step-number">2</span>
            <span className="step-text">Internship Details</span>
          </div>
          <div 
            className={`step ${currentStep === 3 ? 'active' : ''}`}
            onClick={() => handleStepClick(3)}
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

        <div className="form-actions flex justify-end mt4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="reset-button mr3"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            className="submit-button"
          >
            {currentStep === 3 ? 'Post Internship' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostInternship;
