"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation'

export default function ProfilePage() {
  const params = useParams()
  const id = params?.id || params?._id

  const [user, setUser] = useState(null);
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [me, setMe] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`${apiBase}/users/${id}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          if (res.status === 401) {
            setAuthRequired(true);
            setLoading(false);
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message || 'Erreur lors de la récupération');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // fetch current logged user to determine admin status
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;
        const res = await fetch(`${apiBase}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const meData = await res.json();
        setMe(meData);
        setIsAdmin(meData?.role === 'admin');
      } catch (e) {
        // ignore
      }
    };
    fetchMe();
  }, []);

  // initialize form and owner flag when user or me changes
  useEffect(() => {
    if (!user) return;
    setFormData({
      email: user.email || '',
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      address: user.address || '',
      description: user.description || '',
      phoneNumber: user.phoneNumber || '',
      avatar: user.avatar || '',
      role: user.role || 'user'
    });
    setIsOwner(me && user && me._id === user._id);
  }, [user, me]);

  useEffect(() => {
    if (!user) return;

    const fetchUserComments = async () => {
      setCommentsLoading(true);
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
        const res = await fetch(`${apiBase}/commentaries`);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const allComments = await res.json();
        
        const filteredComments = allComments.filter(comment => 
          comment.userId && comment.userId._id === user._id
        );
        
        const sortedComments = filteredComments.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setUserComments(sortedComments);
      } catch (err) {
        console.error('Erreur lors de la récupération des commentaires:', err);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchUserComments();
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleEdit = () => {
    setSaveError(null);
    setSaveSuccess(false);
    setEditMode((s) => !s);
  };

  const handleChange = (key, value) => {
    setFormData((s) => ({ ...s, [key]: value }));
  };

  const saveUpdate = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const payload = { ...formData };
      Object.keys(payload).forEach(k => {
        if (payload[k] === '') delete payload[k];
      });

      const res = await fetch(`${apiBase}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `HTTP ${res.status}`);
      }
      const updated = await res.json();
      setUser(updated);
      setSaveSuccess(true);
      setEditMode(false);
    } catch (e) {
      setSaveError(e.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async () => {
    if (!confirm('Supprimer cet utilisateur ? Cette action est irréversible.')) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${apiBase}/users/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `HTTP ${res.status}`);
      }
  // success: redirect to profile listing page
  try { router.push('/pages/profile'); } catch (e) { router.push('/pages/profile'); }
    } catch (e) {
      setDeleteError(e.message || 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  if (!id) return <div>Identifiant manquant dans l'URL</div>
  if (loading) return (
    <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
      <div className="font-bold mb-4 text-pink-600">Chargement...</div>
    </div>
  )
  if (authRequired) return (
    <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
      <div className="max-w-md mx-auto bg-white/80 p-8 rounded-2xl shadow">
        <h2 className="text-xl font-semibold text-pink-600 mb-2">Veuillez vous inscrire ou vous connecter</h2>
        <p className="text-sm text-pink-700/80 mb-4">Pour accéder à ce profil, vous devez être connecté(e).</p>
        <div className="flex gap-3 justify-end">
          <button className="px-4 py-2 bg-pink-100 text-pink-600 rounded" onClick={() => router.push('/pages/signin')}>Se connecter</button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded" onClick={() => router.push('/pages/signup')}>S'inscrire</button>
        </div>
      </div>
    </div>
  )
  if (error) return <div>Erreur: {error}</div>
  if (!user) return <div>Aucun utilisateur trouvé</div>

  return (
    <div className="min-h-screen flex items-start justify-center bg-pink-100 p-6 sm:p-10 w-full">
      <div className="w-full max-w-6xl">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-pink-600">Mon profil</h1>
            <p className="mt-1 text-pink-400 italic">Voir toutes les informations de profil ici</p>
          </div>
          <div className="mt-2 sm:mt-0 text-sm text-pink-800/60">ID: <span className="font-medium text-pink-600">{user._id || id}</span></div>
        </header>

        <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="col-span-1 flex flex-col items-center md:items-start gap-4 p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-pink-200/40 shadow-lg">
            <div className="w-full flex flex-col items-center md:items-start">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstname} ${user.lastname}`}
                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover object-center border-4 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-white text-2xl font-semibold border-4 border-white shadow-sm">
                    {(user.firstname?.[0] || 'U') + (user.lastname?.[0] || '')}
                  </div>
                )}
              </div>

              <div className="mt-4 w-full">
                {editMode ? (
                  <div className="w-full space-y-3">
                    <div className="flex gap-2 w-full">
                      <input
                        className="flex-1 border rounded px-3 py-2 text-pink-600 w-full"
                        value={formData.firstname}
                        onChange={(e) => handleChange('firstname', e.target.value)}
                        placeholder="Prénom"
                      />
                      <input
                        className="flex-1 border rounded px-3 py-2 text-pink-600 w-full"
                        value={formData.lastname}
                        onChange={(e) => handleChange('lastname', e.target.value)}
                        placeholder="Nom"
                      />
                    </div>

                    <div className="w-full">
                      <label className="text-xs text-pink-800/60 mb-1 block">Avatar (URL)</label>
                      <input
                        className="w-full border rounded px-3 py-2 text-pink-600 placeholder-pink-400"
                        value={formData.avatar}
                        onChange={(e) => handleChange('avatar', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-pink-800/60">Rôle:</span>
                      <select
                        className="border rounded px-2 py-1 text-pink-600"
                        value={formData.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        disabled={!isAdmin}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="text-center md:text-left w-full">
                    <h2 className="text-xl font-semibold text-pink-600">{user.firstname} {user.lastname}</h2>
                    <p className="text-sm text-pink-800/60 mt-1">{user.role || '—'}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full mt-4 p-4 rounded-lg bg-white/60 border border-pink-200/40">
              <h4 className="text-sm font-semibold text-pink-600 mb-2">Statistiques</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-pink-800/60">Commentaires :</span>
                  <span className="font-medium text-pink-600">{userComments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-pink-800/60">Membre depuis :</span>
                  <span className="font-medium text-pink-600">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="col-span-2 space-y-6">
              {/* User info */}
                  <div className="p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-pink-200/40 shadow-lg">
                    <h3 className="text-lg font-semibold text-pink-600 mb-4">Informations personnelles</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/60 border border-pink-200/40">
                      <p className="text-xs text-pink-800/60">Description</p>
                      {editMode ? (
                      <textarea className="mt-1 w-full border rounded p-2 text-pink-600" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                      ) : (
                      <p className="mt-1 text-pink-600">{user.description || '—'}</p>
                      )}
                    </div>

                    <div className="p-4 rounded-lg bg-white/60 border border-pink-200/40">
                      <p className="text-xs text-pink-800/60">Adresse</p>
                      {editMode ? (
                      <input className="mt-1 w-full border rounded px-2 py-1 text-pink-600" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
                      ) : (
                      <p className="mt-1 text-pink-600">{user.address || '—'}</p>
                      )}
                    </div>

                    <div className="p-4 rounded-lg bg-white/60 border border-pink-200/40">
                      <p className="text-xs text-pink-800/60">Email</p>
                      {editMode ? (
                      <input className="mt-1 w-full border rounded px-2 py-1 text-pink-600 break-all" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                      ) : (
                      <p className="mt-1 text-pink-600 break-all">{user.email}</p>
                      )}
                    </div>

                    <div className="p-4 rounded-lg bg-white/60 border border-pink-200/40">
                      <p className="text-xs text-pink-800/60">Téléphone</p>
                      {editMode ? (
                      <input className="mt-1 w-full border rounded px-2 py-1 text-pink-600" value={formData.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} />
                      ) : (
                      <p className="mt-1 text-pink-600">{user.phoneNumber || '—'}</p>
                      )}
                    </div>
                    </div>

                    {/* Admin controls */}
                    <div className="mt-4 flex items-center gap-3 justify-end">
                    {isAdmin && (
                      <>
                      {editMode ? (
                        <>
                        <button className="px-4 py-2 bg-gray-100 text-pink-800 rounded" onClick={() => { setEditMode(false); setFormData({
                          email: user.email || '',
                          firstname: user.firstname || '',
                          lastname: user.lastname || '',
                          address: user.address || '',
                          description: user.description || '',
                          phoneNumber: user.phoneNumber || '',
                          avatar: user.avatar || '',
                          role: user.role || 'user'
                        }); }}>Annuler</button>
                        <button className="px-4 py-2 bg-pink-600 text-white rounded" onClick={saveUpdate} disabled={saving}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
                        </>
                      ) : (
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-pink-600 text-white rounded" onClick={toggleEdit}>Modifier</button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={deleteUser} disabled={deleting}>{deleting ? 'Suppression...' : 'Supprimer'}</button>
                          </div>
                      )}
                      </>
                    )}
                    </div>
                    {saveError && <div className="mt-2 text-sm text-red-600">{saveError}</div>}
                    {saveSuccess && <div className="mt-2 text-sm text-green-600">Modifications enregistrées</div>}
                  </div>

                  {/* User Comments */}
            <div className="p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-pink-200/40 shadow-lg">
              <h3 className="text-lg font-semibold text-pink-600 mb-4">
                Ses commentaires ({userComments.length})
              </h3>

              {commentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-pink-600">
                    <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                    Chargement des commentaires...
                  </div>
                </div>
              ) : userComments.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userComments.map((comment) => (
                    <div 
                      key={comment._id}
                      className="p-4 rounded-lg bg-white/60 border border-pink-200/40 hover:bg-white/80 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {comment.parentId ? (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                              Réponse
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                              Commentaire
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-pink-800/60">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-pink-700 text-sm leading-relaxed">
                        {comment.description}
                      </p>

                      {comment.parentId && (
                        <div className="mt-2 pl-3 border-l-2 border-pink-200">
                          <p className="text-xs text-pink-600/70">
                            En réponse à un autre commentaire
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-pink-600/70">
                    {user.firstname} n'a encore écrit aucun commentaire.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}