import axios from 'axios';
import { authService } from './authService';

const API_URL = 'https://api.swissmote.com/get_assignments';

// Move parseAttachments outside the service object to avoid 'this' binding issues
const parseAttachments = (attachments) => {
  if (!attachments) return [];
  
  const attachmentArray = Array.isArray(attachments) ? attachments : [attachments];
  
  return attachmentArray.map(attachment => {
    if (!attachment) return null;

    try {
      // Handle string-only attachments
      if (typeof attachment === 'string') {
        return {
          type: 'message',
          name: attachment,
          url: null
        };
      }

      // Handle array-type attachments
      if (Array.isArray(attachment)) {
        const [type = '', name = '', url = ''] = attachment;
        return {
          type: type || 'link',
          name: name || url || 'Untitled',
          url: url || name || ''
        };
      }

      // Handle object-type attachments
      if (typeof attachment === 'object') {
        return {
          type: attachment.type || 'link',
          name: attachment.name || attachment.url || 'Untitled',
          url: attachment.url || ''
        };
      }

      return null;
    } catch (error) {
      console.warn('Error parsing attachment:', attachment, error);
      return null;
    }
  }).filter(Boolean); // Remove null values
};

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
          listing: parseInt(listingId, 10),
          source: 'itn',
          row_data: rowData,
          offset_data: offsetData
        }
      });

      // Check if response exists and has data
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }

      const assignmentsData = response.data.data || {};
      
      // Transform the assignments data
      const assignments = Object.entries(assignmentsData).map(([id, data]) => ({
        id,
        candidateId: id,
        candidateName: data.name || 'Unknown',
        company: data.from || 'Not specified',
        status: data.evaluated ? 'evaluated' : 'pending',
        location: data.location || 'Not specified',
        experience: data.job_expreince || 'Not specified', // API typo preserved
        receivedDate: data.recieved_on || 'Not specified', // API typo preserved
        relocation: data.relocation ? 'Yes' : 'No',
        attachments: parseAttachments(data.assignment), // Using the standalone function
        listingNumber: listingId,
        replied: Boolean(data.replied),
        evaluated: Boolean(data.evaluated),
        futureConsideration: Boolean(data.future_consideration)
      }));

      return {
        assignments,
        total: parseInt(response.data.count || 0, 10)
      };
    } catch (error) {
      console.error('Assignment fetch error:', {
        error,
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        listingId
      });
      throw error; // Throw the original error to preserve the stack trace
    }
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
