import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

// GET /api/profiles/:user_id - Get a user's profile
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({ success: true, data: data || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/profiles - Create or update profile (upsert)
router.post('/', async (req, res) => {
  try {
    const { user_id, name, phone, email, avatar_url } = req.body;

    if (!user_id || !name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Fields required: user_id, name, email'
      });
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert([{ user_id, name, phone: phone || null, email, avatar_url: avatar_url || null }], {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/profiles/:user_id - Update profile fields
router.put('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, phone, avatar_url } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
