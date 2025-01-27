import axios from 'axios';
import { authService } from './authService';

const API_URL = 'https://api.swissmote.com/get_assignments';

export const assignmentsService = {
  /**
   * Fetches assignments for a given listing ID
   * @param {number} listingId - The listing ID to fetch assignments for
   * @param {number} rowData - Number of rows to fetch (default: 10)
   * @param {number} offsetData - Offset for pagination (default: 0)
   * @returns {Promise<{assignments: Array, total: number}>}
   */
  getAssignments: async (listingId, rowData = 10, offsetData = 0) => {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await axios({
        method: 'POST',
        url: API_URL,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          listing: parseInt(listingId, 10), // Ensure listingId is an integer
          source: 'itn',
          row_data: rowData,
          offset_data: offsetData
        }
      });

      if (!response.data.success) {
        throw new Error('Failed to fetch assignments');
      }

      const assignmentsData = response.data.data || {};
      const assignments = Object.entries(assignmentsData).map(([id, data]) => ({
        id,
        candidateId: id,
        candidateName: data.name || 'Unknown',
        company: data.from || 'Not specified',
        status: data.evaluated ? 'evaluated' : 'pending',
        location: data.location || 'Not specified',
        experience: data.job_expreince || 'Not specified',
        receivedDate: data.recieved_on || new Date().toISOString(),
        relocation: data.relocation ? 'Yes' : 'No',
        attachments: this._parseAttachments(data.assignment || []),
        listingNumber: listingId,
        replied: data.replied === 1,
        evaluated: data.evaluated,
        futureConsideration: data.future_consideration
      }));

      return {
        assignments,
        total: response.data.count || 0
      };
    } catch (error) {
      console.error('Assignment fetch error:', {
        error,
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        listingId
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
    }
  },

  /**
   * Helper method to parse attachments array from API response
   * @param {Array} attachments - Raw attachments array from API
   * @returns {Array} Formatted attachments array
   */
  _parseAttachments: (attachments) => {
    if (!Array.isArray(attachments)) return [];
    
    return attachments.map(attachment => {
      // Handle string-only attachments (like messages)
      if (typeof attachment === 'string') {
        return {
          type: 'message',
          name: attachment,
          url: null
        };
      }

      // Handle array-type attachments [type, name, url]
      const [type, name, url] = attachment;
      return {
        type: type || 'link',
        name: name || url,
        url: url
      };
    }).filter(attachment => attachment.url || attachment.type === 'message');
  },

  /**
   * Fetches a paginated list of assignments
   * @param {number} listingId - The listing ID to fetch assignments for
   * @param {number} page - Page number (default: 1)
   * @param {number} itemsPerPage - Items per page (default: 10)
   */
  getAssignmentsPage: async (listingId, page = 1, itemsPerPage = 10) => {
    const offset = (page - 1) * itemsPerPage;
    return this.getAssignments(listingId, itemsPerPage, offset);
  }
};
