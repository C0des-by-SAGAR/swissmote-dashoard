import React, { useState } from 'react';
import { 
  FiBriefcase, 
  FiUsers
} from 'react-icons/fi';
import { BiBuilding, BiRupee } from 'react-icons/bi';
import './PostJobs.css';
import { toast } from 'react-toastify';
import { jobService } from '../../../../api/services/jobService';

const organizationMap = {
  'org1': 'pv',
  'org2': 'sa'
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
    workType: 'virtual',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep !== 3) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    if (!formData.jobTitle || !formData.requiredSkills || !formData.positions || 
        !formData.minSalary || !formData.maxSalary || !formData.organization) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const loadingToast = toast.loading('Posting job...');
      
      const formattedData = {
        jobTitle: formData.jobTitle.trim(),
        minExperience: formData.minExperience.trim(),
        requiredSkills: formData.requiredSkills.trim(),
        workType: formData.workType.toLowerCase(),
        employment: formData.employment === 'Full-Time' ? 'full' : 'part',
        positions: formData.positions,
        minSalary: formData.minSalary.replace(/[^0-9]/g, ''),
        maxSalary: formData.maxSalary.replace(/[^0-9]/g, ''),
        organization: organizationMap[formData.organization]
      };
      
      await jobService.postJob(formattedData);
      
      toast.update(loadingToast, {
        render: 'Job posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setFormData({
        jobTitle: '',
        requiredSkills: '',
        positions: '',
        minExperience: '',
        minSalary: '',
        maxSalary: '',
        workType: 'virtual',
        employment: 'Full-Time',
        organization: ''
      });
      
      setCurrentStep(1);
    } catch (error) {
      toast.error(error.message || 'Failed to post job. Please try again.');
    }
  };

  const handleStepClick = (step) => {
    setCurrentStep(step);
  };

  const renderBasicInfo = () => (
    <div className="form-section">
      <h2 className="section-title">Basic Information</h2>
      
      <div className="field-group">
        <label className="field-label">
          Job Title<span className="required">*</span>
        </label>
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleInputChange}
          placeholder="e.g., Senior Software Engineer"
          className="form-input"
          required
        />
      </div>

      <div className="field-group">
        <label className="field-label">
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
          <label className="field-label">Work Type</label>
          <select
            name="workType"
            value={formData.workType}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="virtual">Virtual</option>
            <option value="on-site">On-Site</option>
          </select>
        </div>

        <div className="field-group half-width">
          <label className="field-label">Employment</label>
          <select
            name="employment"
            value={formData.employment}
            onChange={handleInputChange}
            className="form-select"
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
        <div className="w-50-l w-100 pr3-l mb4">
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

        <div className="w-50-l w-100 mb4">
          <label className="field-label">
            <FiBriefcase className="field-icon" />
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
        <div className="w-50-l w-100 pr3-l mb4">
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

        <div className="w-50-l w-100 mb4">
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
        <div className="review-section">
          <h3 className="f4 fw6 mb3">Basic Information</h3>
          <div className="review-item">
            <span className="fw6">Job Title:</span> {formData.jobTitle}
          </div>
          <div className="review-item">
            <span className="fw6">Required Skills:</span> {formData.requiredSkills}
          </div>
          <div className="review-item">
            <span className="fw6">Work Type:</span> {formData.workType}
          </div>
          <div className="review-item">
            <span className="fw6">Employment:</span> {formData.employment}
          </div>
        </div>

        <div className="review-section">
          <h3 className="f4 fw6 mb3">Job Details</h3>
          <div className="review-item mb2">
            <span className="fw6">Positions:</span> {formData.positions}
          </div>
          <div className="review-item mb2">
            <span className="fw6">Min. Experience:</span> {formData.minExperience} Years
          </div>
          <div className="review-item mb2">
            <span className="fw6">Salary Range:</span> ₹{formData.minSalary} - ₹{formData.maxSalary}
          </div>
          <div className="review-item mb2">
            <span className="fw6">Organization:</span> {organizationMap[formData.organization]}
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
            <h1>Post Job</h1>
            <p>Create a job posting to attract talented individuals for your organization.</p>
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
            <span className="step-text">Job Details</span>
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
        {currentStep === 2 && renderJobDetails()}
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
            {currentStep === 3 ? 'Post Job' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobs;