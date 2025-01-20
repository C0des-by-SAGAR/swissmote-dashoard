import { axiosInstance } from '../config';

export const jobsService = {
  postJob: async (jobData) => {
    try {
      const payload = {
        username: jobData.username,
        job_title: jobData.jobTitle,
        min_experience: jobData.minExperience,
        skills: jobData.skills,
        python: jobData.python || false,
        django: jobData.django || false,
        job_type_full: jobData.jobTypeFull || false,
        min_position: jobData.minPosition,
        max_position: jobData.maxPosition,
        min_salary: jobData.minSalary,
        account: jobData.account,
        post_on_linkedin: jobData.postOnLinkedin || false
      };

      const response = await axiosInstance.post('/postJob', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 