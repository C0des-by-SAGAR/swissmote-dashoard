// Hard-coded token configuration
const AUTH_TOKEN = {
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJOaXRlc2gifQ.YQXiLNdHeIz-drgnh7J1Ym2am_89ZM8yGjc9zigJlY0",
  token_type: "Bearer"
};

export const authService = {
  getAuthToken: () => {
    return `${AUTH_TOKEN.token_type} ${AUTH_TOKEN.access_token}`;
  },

  // Helper method to get auth headers
  getAuthHeaders: () => {
    return {
      'Authorization': `${AUTH_TOKEN.token_type} ${AUTH_TOKEN.access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }
};