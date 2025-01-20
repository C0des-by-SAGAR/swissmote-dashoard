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
import { unpaidInternshipsService } from '../../../../api/services/unpaidInternships';
import { toast } from 'react-toastify';

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
    if (currentStep === 3) {
      try {
        const response = await unpaidInternshipsService.postUnpaidInternship({
          username: formData.username || 'default_user',
          internshipTitle: formData.internshipTitle,
          skills: formData.requiredSkills,
          jobTypeFull: formData.employment === 'Full-Time',
          positions: formData.positions,
          duration: formData.duration,
          postOnLinkedin: false
        });

        toast.success('Unpaid internship posted successfully!');
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
        toast.error(error.response?.data?.message || 'Error posting unpaid internship');
      }
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
            <FiClock className="field-icon" />
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

      <div className="important-note mb4">
        <h3 className="f4 mb2">
          <FiAlertTriangle className="mr2 v-mid" /> Important Note
        </h3>
        <p className="ma0">
          This is an unpaid internship opportunity. Ensure candidates understand there is no 
          monetary compensation, but they will gain valuable experience and mentorship.
        </p>
      </div>

      <div className="w-100 mb3">
        <label className="field-label">
          <BiBuilding className="field-icon" />
          Organization
        </label>
        <div className="modern-input bg-light-gray">
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
    <div className="post-internship-container">
      <div className="header-section mb4">
        <div className="flex items-center mb3">
          <div className="header-icon-wrapper mr3">
            <FiBriefcase className="header-icon" />
          </div>
          <div>
            <h1 className="f2 fw6 navy mb0">Post Unpaid Internship</h1>
            <p className="f4 gray mt2 mb0">
              Create a new unpaid internship opportunity to attract talented individuals.
            </p>
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
            <span className="step-text">Internship Details</span>
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

export default PostUnpaidInternship;
