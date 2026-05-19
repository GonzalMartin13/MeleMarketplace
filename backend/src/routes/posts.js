import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

// GET /api/posts - Get all posts (optional filter by type: 'vendo' | 'compro')
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles (
          name,
          phone,
          email,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (type && (type === 'vendo' || type === 'compro')) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/posts/:id - Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          name,
          phone,
          email,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Post not found' });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/posts - Create a new post
router.post('/', async (req, res) => {
  try {
    const { title, description, type, image_url, user_id } = req.body;

    if (!title || !description || !type || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Fields required: title, description, type, user_id'
      });
    }

    if (!['vendo', 'compro'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be "vendo" or "compro"'
      });
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, description, type, image_url: image_url || null, user_id }])
      .select(`
        *,
        profiles (
          name,
          phone,
          email,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/posts/:id - Delete a post (only owner can delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // Verify ownership
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('user_id, image_url')
      .eq('id', id)
      .single();

    if (fetchError || !post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    if (post.user_id !== user_id) {
      return res.status(403).json({ success: false, error: 'You can only delete your own posts' });
    }

    // If there's a stored image (not external URL), delete from storage
    if (post.image_url && post.image_url.includes('supabase')) {
      const path = post.image_url.split('/storage/v1/object/public/images/')[1];
      if (path) {
        await supabase.storage.from('images').remove([path]);
      }
    }

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
