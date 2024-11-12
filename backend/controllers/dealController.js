require('dotenv').config();
const Deal = require('../models/Deal');
const fetch = require('node-fetch');
const { validationResult } = require('express-validator');

// Temporary solution - replace with environment variable later
const PERPLEXITY_API_KEY = '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';

// First, define all your existing controller methods
const getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json({ deals });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ 
      message: 'Error fetching deals',
      error: error.message 
    });
  }
};

const createDeal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    const dealData = {
      ...req.body,
      user_id: req.user.id,
      status: 'pending',
      compliance_status: 'pending',
      images: images
    };

    const deal = await Deal.create(dealData);
    res.status(201).json(deal);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ 
      message: 'Error creating deal',
      error: error.message 
    });
  }
};

const updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findOne({
      where: { 
        id: id,
        user_id: req.user.id 
      }
    });

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const images = req.files ? req.files.map(file => file.path) : deal.images;

    await deal.update({
      ...req.body,
      images: images
    });
    
    res.json(deal);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ 
      message: 'Error updating deal',
      error: error.message 
    });
  }
};

const deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findOne({
      where: { 
        id: id,
        user_id: req.user.id 
      }
    });

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    await deal.destroy();
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ 
      message: 'Error deleting deal',
      error: error.message 
    });
  }
};

// Add the new analyzeDeal method
const analyzeDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByPk(id);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    console.log('Deal data:', deal.toJSON());

    // Validate required fields based on deal type
    if (deal.type === 'insurance') {
      if (!deal.insurance_type) {
        await deal.update({
          status: 'rejected',
          ai_feedback: 'Insurance type is required for insurance deals.'
        });
        return res.status(400).json({
          status: 'rejected',
          feedback: 'Insurance type is required for insurance deals.'
        });
      }
      if (!deal.coverage) {
        await deal.update({
          status: 'rejected',
          ai_feedback: 'Coverage amount is required for insurance deals.'
        });
        return res.status(400).json({
          status: 'rejected',
          feedback: 'Coverage amount is required for insurance deals.'
        });
      }
    }

    // Construct deal text based on deal type
    let dealText = `Title: ${deal.title}\n`;
    dealText += `Type: ${deal.type}\n`;
    dealText += `Description: ${deal.description}\n`;
    dealText += `Amount: £${deal.amount}\n\n`;

    // Add type-specific details
    if (deal.type === 'insurance') {
      dealText += `Insurance Type: ${deal.insurance_type || 'Not specified'}\n`;
      dealText += `Coverage Amount: £${deal.coverage || 'Not specified'}\n`;
    } else if (deal.type === 'property') {
      dealText += `Property Type: ${deal.property_type || 'Not specified'}\n`;
      dealText += `Location: ${deal.location || 'Not specified'}\n`;
    } else if (deal.type === 'car') {
      dealText += `Make: ${deal.make || 'Not specified'}\n`;
      dealText += `Model: ${deal.model || 'Not specified'}\n`;
      dealText += `Year: ${deal.year || 'Not specified'}\n`;
    }

    // Construct a more specific prompt
    const prompt = `You are a compliance officer reviewing deals on a business platform. Your task is to review the following deal and determine if it's appropriate for posting.

REVIEW CRITERIA:
1. The deal must be legal and ethical
2. All required information for the specific deal type must be provided
3. The amount must be reasonable for the type of deal
4. The description must be clear and not misleading

DEAL DETAILS:
${dealText}

INSTRUCTIONS:
- If the deal meets all criteria, respond with "APPROVED"
- If the deal fails any criteria, respond with "REJECTED: [specific reason for rejection]"
- Be concise and specific in rejection reasons
- Focus only on the deal content, not technical issues

Your response:`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const analysisResult = aiResponse.choices[0].message.content;

    // Improved response parsing
    const isApproved = analysisResult.trim().startsWith('APPROVED');
    let status = isApproved ? 'approved' : 'rejected';
    let feedback = isApproved ? null : analysisResult.replace('REJECTED:', '').trim();

    // Update deal
    await deal.update({
      status,
      ai_feedback: feedback
    });

    res.json({
      status,
      feedback
    });

  } catch (error) {
    console.error('Error analyzing deal:', error);
    res.status(500).json({ 
      message: 'Error analyzing deal',
      error: error.message 
    });
  }
};

// Export all methods together
module.exports = {
  getAllDeals,
  createDeal,
  updateDeal,
  deleteDeal,
  analyzeDeal
};