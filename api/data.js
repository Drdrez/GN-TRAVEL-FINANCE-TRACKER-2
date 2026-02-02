import { kv } from '@vercel/kv';

// Data key in KV store
const DATA_KEY = 'gn_finance_data';

// Default data structure
const getDefaultData = () => ({
  incomeRecords: [],
  expenseRecords: [],
  cashAccounts: [],
  cashMovement: {},
  businessColumns: ['Service A', 'Service B'],
  businessData: {},
  dashboardExpenses: {},
  settings: {
    currency: 'PHP',
    year: new Date().getFullYear()
  },
  lastUpdated: new Date().toISOString()
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get all data
      let data = await kv.get(DATA_KEY);
      
      if (!data) {
        data = getDefaultData();
        await kv.set(DATA_KEY, data);
      }
      
      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'POST') {
      // Save all data
      const data = req.body;
      data.lastUpdated = new Date().toISOString();
      
      await kv.set(DATA_KEY, data);
      
      return res.status(200).json({ success: true, message: 'Data saved successfully' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
