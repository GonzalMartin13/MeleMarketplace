const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  // Posts
  async getPosts(type = null) {
    const url = type
      ? `${API_URL}/api/posts?type=${type}`
      : `${API_URL}/api/posts`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async createPost(postData) {
    const res = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async deletePost(id, user_id) {
    const res = await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },

  // Profiles
  async getProfile(user_id) {
    const res = await fetch(`${API_URL}/api/profiles/${user_id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async upsertProfile(profileData) {
    const res = await fetch(`${API_URL}/api/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async updateProfile(user_id, updates) {
    const res = await fetch(`${API_URL}/api/profiles/${user_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  // Upload image
  async uploadImage(file, user_id) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('user_id', user_id);
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.url;
  }
};
