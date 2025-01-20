import { axiosInstance } from '../config';

export const unpaidInternshipsService = {
  postUnpaidInternship: async (internshipData) => {
    try {
      const payload = {
        username: internshipData.username,
        job_title: internshipData.internshipTitle,
        skills: internshipData.skills,
        job_type: "virtual",
        job_type_full: internshipData.jobTypeFull || "part",
        min_position: internshipData.positions,
        duration: internshipData.duration,
        post_on_linkedin: internshipData.postOnLinkedin || false
      };

      const response = await axiosInstance.post('/unpaidArmy', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 