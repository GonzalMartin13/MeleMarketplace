import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) { setError('El nombre es obligatorio.'); return; }
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await api.updateProfile(user.id, { name: name.trim(), phone: phone.trim() || null });
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.pin}>
          <div className={styles.pinHead} />
          <div className={styles.pinNeedle} />
        </div>

        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Volver al tablero
        </button>

        <h2 className={styles.title}>Mi Perfil</h2>

        {profile?.avatar_url && (
          <img src={profile.avatar_url} alt={profile.name} className={styles.avatar} />
        )}

        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="text"
              className={styles.input}
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.5 }}
            />
            <span className={styles.hint}>El email viene de tu cuenta Google</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Nombre *</label>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre completo"
              maxLength={80}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Teléfono / WhatsApp</label>
            <input
              type="tel"
              className={styles.input}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="11 1234-5678"
              maxLength={20}
            />
            <span className={styles.hint}>Se mostrará en tus publicaciones de contacto</span>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.successMsg}>✓ Perfil actualizado</p>}

          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
