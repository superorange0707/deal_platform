import api from './api';

export const getDeals = async () => {
  try {
    const response = await api.get('/deals');
    return response.data;
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
};

export const createDeal = async (dealData) => {
  try {
    const response = await api.post('/deals', dealData);
    return response.data;
  } catch (error) {
    console.error('Error creating deal:', error);
    throw error;
  }
};

export const updateDeal = async (id, dealData) => {
  try {
    const response = await api.put(`/deals/${id}`, dealData);
    return response.data;
  } catch (error) {
    console.error('Error updating deal:', error);
    throw error;
  }
};

export const deleteDeal = async (id) => {
  try {
    const response = await api.delete(`/deals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
};

export const getDealById = async (id) => {
  try {
    const response = await api.get(`/deals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deal:', error);
    throw error;
  }
}; 