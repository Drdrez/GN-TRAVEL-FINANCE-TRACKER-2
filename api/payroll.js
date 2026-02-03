import { supabase } from './lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('payroll_records').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data: data });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const record = req.body;
      const row = {
        id: record.id || Date.now().toString(),
        payout_date: record.payoutDate,
        employee_name: record.name,
        role_position: record.role,
        project_client: record.client,
        employment_type: record.type,
        pay_period: record.period,
        rate: record.rate,
        total_hours: record.hours,
        base_pay: record.basePay,
        bonus_incentives: record.bonus,
        deductions: record.deductions,
        total_payout: record.total,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase.from('payroll_records').upsert(row, { onConflict: 'id' }).select().single();
      if (error) throw error;
      
      return res.status(200).json({ success: true, data: data });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const { error } = await supabase.from('payroll_records').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Deleted' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
