import axios from 'axios';

const fetchPortfolioEntries = async () => {
  try {
    const response = await axios.get('https://jr-narayani.vercel.app/api/getPortfolioEntries');
    console.log('Portfolio entries:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch portfolio entries:', error);
    return [];
  }
};

export default fetchPortfolioEntries;