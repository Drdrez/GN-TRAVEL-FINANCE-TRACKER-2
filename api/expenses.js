import { kv } from '@vercel/kv';

const EXPENSES_KEY = 'gn_expense_records';

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
      const records = await kv.get(EXPENSES_KEY) || [];
      return res.status(200).json({ success: true, data: records });
    }

    if (req.method === 'POST') {
      const record = req.body;
      record.id = record.id || Date.now().toString();
      record.createdAt = record.createdAt || new Date().toISOString();
      record.updatedAt = new Date().toISOString();
      
      const records = await kv.get(EXPENSES_KEY) || [];
      records.push(record);
      await kv.set(EXPENSES_KEY, records);
      
      return res.status(201).json({ success: true, data: record });
    }

    if (req.method === 'PUT') {
      const data = req.body;
      
      // If array is passed, replace all records (bulk update)
      if (Array.isArray(data)) {
        await kv.set(EXPENSES_KEY, data);
        return res.status(200).json({ success: true, data: data });
      }
      
      // Single record update
      const record = data;
      record.updatedAt = new Date().toISOString();
      
      let records = await kv.get(EXPENSES_KEY) || [];
      const index = records.findIndex(r => r.id === record.id);
      
      if (index !== -1) {
        records[index] = record;
        await kv.set(EXPENSES_KEY, records);
        return res.status(200).json({ success: true, data: record });
      }
      
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      let records = await kv.get(EXPENSES_KEY) || [];
      records = records.filter(r => r.id !== id);
      await kv.set(EXPENSES_KEY, records);
      
      return res.status(200).json({ success: true, message: 'Record deleted' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Expenses API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
