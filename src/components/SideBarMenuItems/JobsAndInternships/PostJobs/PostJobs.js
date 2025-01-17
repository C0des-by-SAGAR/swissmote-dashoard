import React, { useState } from 'react';
import { 
  FiBriefcase, 
  FiUsers, 
  FiClock,
  FiMonitor,
  FiAward,
  FiCode
} from 'react-icons/fi';
import { BiBuilding, BiRupee } from 'react-icons/bi';
import './PostJobs.css';

const organizationMap = {
  'org1': 'Persist Ventures',
  'org2': 'Systemic Altruism'
};

const PostJobs = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: '',
    requiredSkills: '',
    positions: '',
    minExperience: '',
    minSalary: '',
    maxSalary: '',
    workType: 'Virtual',
    employment: 'Full-Time',
    organization: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === 3) {
      console.log('Form submitted:', formData);
    } else {
      setCurrentStep(prev => prev + 1);
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
          Job Title<span className="required">*</span>
        </label>
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleInputChange}
          placeholder="e.g., Senior Software Engineer"
          className="modern-input"
          required
        />
      </div>

      <div className="field-group mb4">
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
            <option value="Hybrid">On-Site</option>
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
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderJobDetails = () => (
    <div className="form-section-card mb4">
      <div className="section-header">
        <h2 className="f3 fw6 mb3">Job Details</h2>
        <div className="section-divider"></div>
      </div>
      
      <div className="flex flex-wrap">
        <div className="w-third-l w-100 pr3-l mb4">
          <label className="field-label">
            <FiUsers className="field-icon" />
            Positions
          </label>
          <input
            type="number"
            name="positions"
            value={formData.positions}
            onChange={handleInputChange}
            placeholder="e.g., 5"
            className="modern-input"
            min="1"
          />
        </div>

        <div className="w-third-l w-100 pr3-l mb4">
          <label className="field-label">
            <FiAward className="field-icon" />
            Min. Experience
          </label>
          <input
            type="text"
            name="minExperience"
            value={formData.minExperience}
            onChange={handleInputChange}
            placeholder="Years"
            className="modern-input"
          />
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="w-third-l w-100 pr3-l mb4">
          <label className="field-label">
            <BiRupee className="field-icon" />
            Min. Salary<span className="required">*</span>
          </label>
          <input
            type="text"
            name="minSalary"
            value={formData.minSalary}
            onChange={handleInputChange}
            placeholder="Min ₹200,000"
            className="modern-input"
            required
          />
        </div>

        <div className="w-third-l w-100 mb4">
          <label className="field-label">
            <BiRupee className="field-icon" />
            Max. Salary
          </label>
          <input
            type="text"
            name="maxSalary"
            value={formData.maxSalary}
            onChange={handleInputChange}
            placeholder="e.g., ₹500,000"
            className="modern-input"
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
        <h2 className="f3 fw6 mb3">Review Your Job Posting</h2>
        <div className="section-divider"></div>
      </div>
      
      <div className="review-content">
        <div className="review-section mb4">
          <h3 className="f4 fw6 mb3">Basic Information</h3>
          <div className="review-item mb2">
            <span className="fw6">Job Title:</span> {formData.jobTitle}
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
          <h3 className="f4 fw6 mb3">Job Details</h3>
          <div className="review-item mb2">
            <span className="fw6">Positions:</span> {formData.positions}
          </div>
          <div className="review-item mb2">
            <span className="fw6">Experience Required:</span> {formData.minExperience} Years
          </div>
          <div className="review-item mb2">
            <span className="fw6">Salary Range:</span> ₹{formData.minSalary} - ₹{formData.maxSalary}
          </div>
          <div className="review-item mb2">
            <span className="fw6">Organization:</span> {organizationMap[formData.organization] || formData.organization}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="post-job-container">
      <div className="header-section mb4">
        <div className="flex items-center mb3">
          <div className="header-icon-wrapper mr3">
            <FiBriefcase className="header-icon" />
          </div>
          <div>
            <h1 className="f2 fw6 navy mb0">Post Job</h1>
            <p className="f4 gray mt2 mb0">Create a professional job posting to attract the best talent.</p>
          </div>
        </div>
        <div className="progress-bar mt4">
          <div 
            className={`progress-step ${currentStep === 1 ? 'active' : ''}`}
            onClick={() => handleStepClick(1)}
          >
            <span className="step-number">1</span>
            <span className="step-text">Basic Info</span>
          </div>
          <div 
            className={`progress-step ${currentStep === 2 ? 'active' : ''}`}
            onClick={() => handleStepClick(2)}
          >
            <span className="step-number">2</span>
            <span className="step-text">Job Details</span>
          </div>
          <div 
            className={`progress-step ${currentStep === 3 ? 'active' : ''}`}
            onClick={() => handleStepClick(3)}
          >
            <span className="step-number">3</span>
            <span className="step-text">Review</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderBasicInfo()}
        {currentStep === 2 && renderJobDetails()}
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
            {currentStep === 3 ? 'Post Job' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobs;