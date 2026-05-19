import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import CreatePostModal from './CreatePostModal.jsx';
import styles from './Navbar.module.css';

export default function Navbar({ filter, onFilterChange }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isHome = location.pathname === '/';

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <>
      <nav className={styles.navbar}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => navigate('/')}>
          <span className={styles.logoText}>Mele</span>
          <span className={styles.logoSub}>Marketplace</span>
        </div>

        {/* Center filters - only on home */}
        {isHome && user && (
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => onFilterChange('all')}
            >
              Todos
            </button>
            <button
              className={`${styles.filterBtn} ${styles.vendo} ${filter === 'vendo' ? styles.active : ''}`}
              onClick={() => onFilterChange('vendo')}
            >
              Vendo
            </button>
            <button
              className={`${styles.filterBtn} ${styles.compro} ${filter === 'compro' ? styles.active : ''}`}
              onClick={() => onFilterChange('compro')}
            >
              Compro
            </button>
            <button
              className={styles.publishBtn}
              onClick={() => setShowModal(true)}
            >
              <span>+</span> Publicar
            </button>
          </div>
        )}

        {/* User menu */}
        {user && (
          <div className={styles.userArea}>
            <button
              className={styles.userBtn}
              onClick={() => setShowUserMenu(v => !v)}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarFallback}>
                  {(profile?.name || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className={styles.userName}>{profile?.name?.split(' ')[0]}</span>
              <span className={styles.chevron}>{showUserMenu ? '▲' : '▼'}</span>
            </button>
            {showUserMenu && (
              <div className={styles.dropdown}>
                <button onClick={() => { navigate('/perfil'); setShowUserMenu(false); }}>
                  👤 Mi perfil
                </button>
                <button onClick={handleSignOut}>
                  🚪 Salir
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            window.dispatchEvent(new Event('post-created'));
          }}
        />
      )}
    </>
  );
}
