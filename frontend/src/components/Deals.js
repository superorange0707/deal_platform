import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { getDeals } from '../services/dealService';
import NewDealModal from './deals/NewDealModal';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await getDeals();
      setDeals(response.deals || []);
    } catch (error) {
      message.error('Failed to fetch deals');
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // ... rest of your component code ...
};

export default Deals; 