"use client";

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation'

export default function ProfilePage() {
  const params = useParams()
  const id = params?.id || params?._id

  const [user, setUser] = useState(null);
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  if (!id) return <div>Identifiant manquant dans l'URL</div>
  if (loading) return (
    <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
      <div className="font-bold mb-4 text-pink-600">Chargement...</div>
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
          {/* Profile card */}
          <section className="col-span-1 flex flex-col items-center md:items-start gap-4 p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-pink-200/40 shadow-lg">
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

            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-pink-600">{user.firstname} {user.lastname}</h2>
              <p className="text-sm text-pink-800/60 mt-1">{user.role || '—'}</p>
            </div>

            {/* Stats */}
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
                  <p className="mt-1 text-pink-600">{user.description || '—'}</p>
                </div>

                <div className="p-4 rounded-lg bg-white/60 border border-pink-200/40">
                  <p className="text-xs text-pink-800/60">Adresse</p>
                  <p className="mt-1 text-pink-600">{user.address || '—'}</p>
                </div>

                <div className="p-4 rounded-lg bg-white/60 border border-pink-200/40">
                  <p className="text-xs text-pink-800/60">Email</p>
                  <p className="mt-1 text-pink-600 break-all">{user.email}</p>
                </div>

                <div className="p-4 rounded-lg bg-white/60 border border-pink-200/40">
                  <p className="text-xs text-pink-800/60">Téléphone</p>
                  <p className="mt-1 text-pink-600">{user.phoneNumber || '—'}</p>
                </div>
              </div>
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