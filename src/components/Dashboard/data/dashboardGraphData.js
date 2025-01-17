export const followUpData = [
  { name: 'Day 2 Sent', value: 20, color: '#80CBC4' },
  { name: 'Day 2 Pending', value: 4, color: '#FFE082' },
  { name: 'Day 4 Sent', value: 20, color: '#90CAF9' },
  { name: 'Day 4 Pending', value: 4, color: '#F48FB1' },
];

export const conversionData = [
  { name: '0-25%', value: 11, color: '#F48FB1' },
  { name: '26-50%', value: 2, color: '#FFE082' },
  { name: '51-75%', value: 5, color: '#90CAF9' },
  { name: '76-100%', value: 6, color: '#80CBC4' },
];

export const reviewData = [
  { name: 'Reviews Added', value: 5, color: '#80CBC4' },
  { name: 'Reviews Pending', value: 19, color: '#F48FB1' },
];

export const summaryData = {
  followUp: {
    day2: { sent: 20, pending: 4 },
    day4: { sent: 20, pending: 4 }
  },
  distribution: {
    '0-25%': 11,
    '26-50%': 2,
    '51-75%': 5,
    '76-100%': 6
  },
  reviews: {
    added: 5,
    pending: 19
  }
}; 