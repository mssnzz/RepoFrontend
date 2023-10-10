// api.ts
import axios from 'axios';

const BASE_URL = 'https://repobackend-production.up.railway.app/';

export const fetchRepoData = async (owner: string, repo: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/github/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching repo data:", error);
    throw error;
  }
};
