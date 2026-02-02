import { kv } from '@vercel/kv';

const CASH_ACCOUNTS_KEY = 'gn_cash_accounts';
const CASH_MOVEMENT_KEY = 'gn_cash_movement';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type } = req.query; // 'accounts' or 'movement'

  try {
    const key = type === 'movement' ? CASH_MOVEMENT_KEY : CASH_ACCOUNTS_KEY;

    if (req.method === 'GET') {
      const data = await kv.get(key) || (type === 'movement' ? {} : []);
      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'POST') {
      if (type === 'movement') {
        // Cash movement is stored as an object with month keys
        const movement = req.body;
        await kv.set(key, movement);
        return res.status(200).json({ success: true, data: movement });
      } else {
        // Cash accounts are stored as an array
        const record = req.body;
        record.id = record.id || Date.now().toString();
        record.createdAt = record.createdAt || new Date().toISOString();
        record.updatedAt = new Date().toISOString();
        
        const records = await kv.get(key) || [];
        records.push(record);
        await kv.set(key, records);
        
        return res.status(201).json({ success: true, data: record });
      }
    }

    if (req.method === 'PUT') {
      if (type === 'movement') {
        const movement = req.body;
        await kv.set(key, movement);
        return res.status(200).json({ success: true, data: movement });
      } else {
        const data = req.body;
        
        // If array is passed, replace all records (bulk update)
        if (Array.isArray(data)) {
          await kv.set(key, data);
          return res.status(200).json({ success: true, data: data });
        }
        
        // Single record update
        const record = data;
        record.updatedAt = new Date().toISOString();
        
        let records = await kv.get(key) || [];
        const index = records.findIndex(r => r.id === record.id);
        
        if (index !== -1) {
          records[index] = record;
          await kv.set(key, records);
          return res.status(200).json({ success: true, data: record });
        }
        
        return res.status(404).json({ success: false, error: 'Record not found' });
      }
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      let records = await kv.get(key) || [];
      records = records.filter(r => r.id !== id);
      await kv.set(key, records);
      
      return res.status(200).json({ success: true, message: 'Record deleted' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Cash API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
