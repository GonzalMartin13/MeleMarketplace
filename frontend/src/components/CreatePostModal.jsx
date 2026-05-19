import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import styles from './CreatePostModal.module.css';

export default function CreatePostModal({ onClose, onCreated }) {
  const { user } = useAuth();
  const [type, setType] = useState('vendo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageMode, setImageMode] = useState('url'); // 'url' | 'file'
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !description.trim()) {
      setError('Título y descripción son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = null;

      if (type === 'vendo') {
        if (imageMode === 'url' && imageUrl.trim()) {
          finalImageUrl = imageUrl.trim();
        } else if (imageMode === 'file' && imageFile) {
          finalImageUrl = await api.uploadImage(imageFile, user.id);
        }
      }

      await api.createPost({
        title: title.trim(),
        description: description.trim(),
        type,
        image_url: finalImageUrl,
        user_id: user.id
      });

      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nueva publicación</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Type selector */}
          <div className={styles.typeRow}>
            <button
              type="button"
              className={`${styles.typeBtn} ${type === 'vendo' ? styles.typeBtnVendo : ''}`}
              onClick={() => setType('vendo')}
            >
              🏷️ Vendo
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${type === 'compro' ? styles.typeBtnCompro : ''}`}
              onClick={() => setType('compro')}
            >
              🔍 Compro
            </button>
          </div>

          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label}>Título *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Ej: Bicicleta mountain bike"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>Descripción *</label>
            <textarea
              className={styles.textarea}
              placeholder={type === 'vendo' ? 'Estado, precio, detalles...' : 'Qué buscás, en qué estado lo querés...'}
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Image (only for vendo) */}
          {type === 'vendo' && (
            <div className={styles.field}>
              <label className={styles.label}>Imagen (opcional)</label>
              <div className={styles.imageModeRow}>
                <button
                  type="button"
                  className={`${styles.modeBtn} ${imageMode === 'url' ? styles.modeBtnActive : ''}`}
                  onClick={() => setImageMode('url')}
                >
                  🔗 URL
                </button>
                <button
                  type="button"
                  className={`${styles.modeBtn} ${imageMode === 'file' ? styles.modeBtnActive : ''}`}
                  onClick={() => setImageMode('file')}
                >
                  📁 Archivo
                </button>
              </div>

              {imageMode === 'url' ? (
                <input
                  type="url"
                  className={styles.input}
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={e => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                />
              ) : (
                <div
                  className={styles.dropzone}
                  onClick={() => fileRef.current.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className={styles.preview} />
                  ) : (
                    <span>Hacé clic para seleccionar imagen</span>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              )}

              {imagePreview && imageMode === 'url' && (
                <img src={imagePreview} alt="preview" className={styles.preview} style={{ marginTop: '0.5rem' }}
                  onError={e => e.target.style.display = 'none'} />
              )}
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </form>
      </div>
    </div>
  );
}
