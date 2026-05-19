import express from 'express';
import multer from 'multer';
import { supabase } from '../supabase.js';

const router = express.Router();

// Store files in memory for Supabase upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WEBP and GIF images are allowed'));
    }
  }
});

// POST /api/upload - Upload image to Supabase Storage
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    const ext = req.file.originalname.split('.').pop();
    const fileName = `${user_id}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    res.json({ success: true, url: publicUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
