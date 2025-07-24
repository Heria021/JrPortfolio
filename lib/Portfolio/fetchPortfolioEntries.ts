import axios from 'axios';

const fetchPortfolioEntries = async () => {
  try {
    // Use local API endpoint for portfolio entries
    const response = await axios.get('/api/public/portfolio');
    console.log('Portfolio entries:', response.data);
    return response.data.data; // Extract the data array from the response
  } catch (error) {
    console.error('Failed to fetch portfolio entries:', error);
    return [];
  }
};

export default fetchPortfolioEntries;