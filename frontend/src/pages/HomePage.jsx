import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar.jsx';
import PostCard from '../components/PostCard.jsx';
import { api } from '../lib/api.js';
// import { supabase } from '../lib/supabase.js';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getPosts(filter === 'all' ? null : filter);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Polling - refresca cada 10 segundos
useEffect(() => {
  const interval = setInterval(() => {
    fetchPosts();
  }, 10000);

  return () => clearInterval(interval);
}, [fetchPosts]);

  // Realtime - escucha cambios en la tabla posts
/*   useEffect(() => {
    const channel = supabase
      .channel('posts-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          // Cada vez que alguien publica o elimina, recarga los posts
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]); */

  function handleDeleted(id) {
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className={styles.page}>
      <Navbar filter={filter} onFilterChange={setFilter} />

      <div className={styles.boardWrapper}>
        <div className={styles.metalFrame}>
          <div className={styles.board}>
            <div className={styles.corkTexture} />

            {loading && (
              <div className={styles.stateMsg}>
                <div className={styles.spinner} />
                <span>Cargando publicaciones...</span>
              </div>
            )}

            {error && (
              <div className={styles.errorMsg}>
                ⚠️ {error}
              </div>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className={styles.emptyMsg}>
                <p>No hay publicaciones aún.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', opacity: 0.7 }}>
                  ¡Sé el primero en publicar algo!
                </p>
              </div>
            )}

            {!loading && !error && posts.length > 0 && (
              <div className={styles.grid}>
                {posts.map((post, i) => (
                  <div key={post.id} style={{ animationDelay: `${i * 0.07}s` }}>
                    <PostCard post={post} onDeleted={handleDeleted} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}