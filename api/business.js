import { kv } from '@vercel/kv';

const BUSINESS_COLUMNS_KEY = 'gn_business_columns';
const BUSINESS_DATA_KEY = 'gn_business_data';
const DASHBOARD_EXPENSES_KEY = 'gn_dashboard_expenses';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const columns = await kv.get(BUSINESS_COLUMNS_KEY) || ['Service A', 'Service B'];
      const data = await kv.get(BUSINESS_DATA_KEY) || {};
      const expenses = await kv.get(DASHBOARD_EXPENSES_KEY) || {};
      
      return res.status(200).json({ 
        success: true, 
        data: { columns, businessData: data, dashboardExpenses: expenses }
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const { columns, businessData, dashboardExpenses } = req.body;
      
      if (columns !== undefined) {
        await kv.set(BUSINESS_COLUMNS_KEY, columns);
      }
      if (businessData !== undefined) {
        await kv.set(BUSINESS_DATA_KEY, businessData);
      }
      if (dashboardExpenses !== undefined) {
        await kv.set(DASHBOARD_EXPENSES_KEY, dashboardExpenses);
      }
      
      return res.status(200).json({ success: true, message: 'Business data saved' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Business API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
