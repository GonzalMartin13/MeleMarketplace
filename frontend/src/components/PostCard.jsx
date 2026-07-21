import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import styles from './PostCard.module.css';

const { user, profile } = useAuth();

function getCardStyle(id) {
  const code = id ? id.charCodeAt(0) + id.charCodeAt(id.length - 1) : 0;
  const tilt = ((code % 7) - 3) * 0.8;
  const papers = [styles.paperWhite, styles.paperYellow, styles.paperBlue, styles.paperPink];
  const paper = papers[code % papers.length];
  return { tilt, paper };
}

export default function PostCard({ post, onDeleted }) {
  const { user, profile } = useAuth();
  const [showContact, setShowContact] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isOwner = user?.id === post.user_id || profile?.is_admin === true;
  console.log('profile:', profile);
console.log('is_admin:', profile?.is_admin);
console.log('isOwner:', isOwner);
  const isVendo = post.type === 'vendo';
  const { tilt, paper } = getCardStyle(post.id);

  async function handleDelete() {
    if (!window.confirm('¿Eliminás esta publicación?')) return;
    setDeleting(true);
    try {
      await api.deletePost(post.id, user.id);
      onDeleted(post.id);
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
      setDeleting(false);
    }
  }

  return (
    <div
      className={`${styles.wrapper} ${hovered ? styles.wrapperHovered : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ '--tilt': `${tilt}deg` }}
    >
      <div className={`${styles.pin} ${isVendo ? styles.pinRed : styles.pinBlue}`}>
        <div className={styles.pinHead} />
        <div className={styles.pinNeedle} />
      </div>

      <div className={`${styles.card} ${paper}`}>
        <div className={`${styles.badge} ${isVendo ? styles.badgeVendo : styles.badgeCompro}`}>
          {isVendo ? 'VENDO' : 'COMPRO'}
        </div>

        <h3 className={styles.title}>{post.title}</h3>

        {isVendo && post.image_url && (
          <div className={styles.imageWrapper}>
            <img
              src={post.image_url}
              alt={post.title}
              className={styles.image}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <p className={styles.description}>{post.description}</p>

        <div className={styles.tornEdge} />

        <div className={styles.footer}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>
              {post.profiles?.name || 'Anónimo'}
            </span>
          </div>

          <div className={styles.actions}>
            {!showContact ? (
              <button
                className={styles.contactBtn}
                onClick={() => setShowContact(true)}
              >
                Ver contacto
              </button>
            ) : (
              <div className={styles.contactInfo}>
                {post.profiles?.phone && (
                  
                    href={`https://wa.me/54${post.profiles.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.contactItem}
                  >
                    📱 {post.profiles.phone}
                  </a>
                )}
                <span className={styles.contactItem}>
                  ✉️ {post.profiles?.email}
                </span>
              </div>
            )}

            {isOwner && (
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={deleting}
                title="Eliminar publicación"
              >
                {deleting ? '...' : '✕'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}