"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import AddButton from '../../components/addButton';

export default function CommentariesPage() {
  const [commentaries, setCommentaries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userComments, setUserComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [showResponses, setShowResponses] = useState({});
  const [responsesMap, setResponsesMap] = useState({});
  const [replyTextLocal, setReplyTextLocal] = useState({});
  const [hasResponsesCount, setHasResponsesCount] = useState({});
  const [replyFormOpen, setReplyFormOpen] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const [replyErrorLocal, setReplyErrorLocal] = useState({});
  const [usersMap, setUsersMap] = useState({});

  const displayName = (user) => {
    if (!user) return 'Utilisateur supprimé';
    if (typeof user === 'string') {
      const cached = usersMap[user];
      if (cached) return `${(cached.firstname || '').trim()} ${(cached.lastname || '').trim()}`.trim() || 'Utilisateur';
      return 'Utilisateur';
    }
    const fn = user.firstname || '';
    const ln = user.lastname || '';
    const full = `${fn} ${ln}`.trim();
    return full || 'Utilisateur';
  };

  const fetchUser = async (id) => {
    if (!id) return null;
    if (usersMap[id]) return usersMap[id];
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${apiBase}/users/${id}`, { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
      if (!res.ok) return null;
      const u = await res.json();
      setUsersMap((s) => ({ ...s, [id]: u }));
      return u;
    } catch (err) {
      return null;
    }
  };

  const fetchMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$|\/+$/, '');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
        // If not authenticated redirect to signin
        router.push('/signin');
        return;
      }

      const res = await fetch(`${apiBase}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || 'Impossible de récupérer les informations du profil');
      }

      const data = await res.json();
      const newUser = data.user || data;
      setCurrentUser(newUser);

      // fetch all comments and filter by this user
      setCommentsLoading(true);
      try {
        const cRes = await fetch(`${apiBase}/commentaries`);
        if (!cRes.ok) throw new Error(`HTTP ${cRes.status}`);
        const allComments = await cRes.json();
        const filtered = (Array.isArray(allComments) ? allComments : []).filter(c => {
          if (!c.userId) return false;
          const uid = newUser._id || newUser.id;
          if (typeof c.userId === 'string') return c.userId === uid;
          return (c.userId._id === uid) || (c.userId === uid);
        });
        const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUserComments(sorted);
      } catch (err) {
        console.error('Erreur récupération commentaires:', err);
        setUserComments([]);
      } finally {
        setCommentsLoading(false);
      }

      return;
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCommentaries = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '')
        const res = await fetch(`${apiBase}/commentaries`)
        // const res = await fetch(
        //   `http://localhost:3001/commentaries`
        // );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCommentaries(data);
        data.forEach((c) => {
          const uid = c.userId;
          if (uid && typeof uid === 'string' && !usersMap[uid]) {
            fetchUser(uid).catch(() => null);
          }
        });
      } catch (err) {
        setError(err.message || "Erreur lors de la récupération");
      } finally {
        setLoading(false);
      }
    };

    fetchCommentaries();
    // also fetch current user (if any)
    fetchMe();
  }, []);

  useEffect(() => {
    if (!commentaries.length) return;
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
    commentaries.forEach(async (c) => {
      try {
        const res = await fetch(`${apiBase}/commentaries/responses/${c._id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setHasResponsesCount((s) => ({ ...s, [c._id]: data.length }));
        }
      } catch (err) {
        // ignore
      }
    });
  }, [commentaries]);

  const sendReply = async (parentId) => {
    const txt = (replyTextLocal[parentId] || '').trim();
    if (!txt) return;
    setReplyErrorLocal((s) => ({ ...s, [parentId]: null }));
    setReplyLoading((s) => ({ ...s, [parentId]: true }));
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${apiBase}/commentaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ description: txt, parentId }),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error('Vous devez être connecté pour répondre.');
        const body = await res.text().catch(() => null);
        throw new Error(body || `HTTP ${res.status}`);
      }
      const created = await res.json();
      const createdForClient = { ...created };
      // If backend returned only an id for userId, try to fetch the actual user and update later
      if (createdForClient.userId && typeof createdForClient.userId === 'string') {
        const uid = createdForClient.userId;
        // optimistically insert with the id (displayName will try to resolve from cache)
        setResponsesMap((s) => ({ ...s, [parentId]: s[parentId] ? [createdForClient, ...s[parentId]] : [createdForClient] }));
        // fetch user and update cache/state when resolved
        fetchUser(uid).then((u) => {
          if (!u) return;
          setResponsesMap((s) => ({ ...s, [parentId]: (s[parentId] || []).map(item => item.userId === uid ? { ...item, userId: u } : item) }));
        }).catch(() => null);
      } else {
        // either populated user object or missing -> just insert
        setResponsesMap((s) => ({ ...s, [parentId]: s[parentId] ? [createdForClient, ...s[parentId]] : [createdForClient] }));
      }
  setHasResponsesCount((s) => ({ ...s, [parentId]: (s[parentId] || 0) + 1 }));
      setReplyTextLocal((s) => ({ ...s, [parentId]: '' }));
      setReplyFormOpen((s) => ({ ...s, [parentId]: false }));
    } catch (err) {
      console.error(err);
      setReplyErrorLocal((s) => ({ ...s, [parentId]: err.message || 'Erreur lors de l’envoi' }));
    } finally {
      setReplyLoading((s) => ({ ...s, [parentId]: false }));
    }
  };

  const deleteComment = async (id) => {
    if (!id) return;
    if (!confirm('Supprimer ce commentaire ? Cette action est irréversible.')) return;
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${apiBase}/commentaries/${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // remove from commentaries list
      setCommentaries((prev) => prev.filter((c) => c._id !== id));
      // also remove responses and counts if present
      setResponsesMap((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
      setHasResponsesCount((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert(`Erreur lors de la suppression: ${err.message || err}`);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
        <div className="font-bold mb-4 text-pink-600">
          Chargement des commentaires...
        </div>
      </div>
    );
  if (error) return <div>Erreur: {error}</div>;

  return (
    <main className="min-h-screen bg-pink-100 p-6 md:p-12 w-full">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 tracking-tight">
            Commentaires
          </h1>
          <p className="text-sm text-pink-800/85 mt-2">
            {commentaries.length} commentaire{commentaries.length > 1 ? 's' : ''} • Derniers échanges
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commentaries.length === 0 ? (
            <div className="col-span-full bg-white/50 backdrop-blur-sm rounded-2xl p-8 text-center text-pink-700 shadow-sm">
              Aucun commentaire pour le moment.
            </div>
          ) : (
            commentaries.map((c) => {
              let user = c.userId || null;
              if (user && typeof user === 'string' && usersMap[user]) user = usersMap[user];
              const initials = user
                ? `${(user.firstname || '').charAt(0)}${(user.lastname || '').charAt(0)}`.toUpperCase()
                : 'U';

              return (
                <article
                  key={c._id}
                  className="relative bg-gradient-to-br from-pink-50 via-white/60 to-pink-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-200 ease-out flex flex-col"
                  aria-labelledby={`comment-title-${c._id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {user && user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={`${displayName(user)} avatar`}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-semibold text-lg ring-2 ring-pink-100">
                          {initials}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2
                            id={`comment-title-${c._id}`}
                            className="text-base md:text-lg font-semibold text-pink-900 truncate"
                          >
                            {displayName(user)}
                          </h2>
                          <div className="flex items-center gap-3 mt-1">
                            <time
                              dateTime={c.createdAt}
                              className="text-xs text-pink-800/80"
                              title={new Date(c.createdAt).toLocaleString()}
                            >
                              {new Date(c.createdAt).toLocaleString()}
                            </time>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          {user && (
                            <Link
                              href={`/pages/profile/${user._id || user}`}
                              className="text-pink-700 text-sm hover:underline"
                              aria-label={`Voir le profil de ${displayName(user)}`}
                            >
                              Profil
                            </Link>
                          )}

                          {/* Admin-only delete button */}
                          {currentUser && currentUser.role === 'admin' && (
                            <button
                              type="button"
                              className="text-sm text-red-600 hover:underline ml-2"
                              onClick={() => deleteComment(c._id)}
                              aria-label={`Supprimer le commentaire de ${displayName(user)}`}
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                      </div>

                        <div className="mt-3 text-pink-600 text-sm md:text-base leading-relaxed">
                        <details className="group">
                          <summary className="list-none cursor-pointer select-none">
                            <span className="line-clamp-3 group-open:line-clamp-none">{c.description}</span>
                          </summary>
                        </details>
                      </div>
                        <div className="mt-3">
                          {hasResponsesCount[c._id] > 0 && !showResponses[c._id] && (
                            <button
                              className="text-sm text-pink-600 hover:underline"
                              onClick={async () => {
                                try {
                                  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
                                  const res = await fetch(`${apiBase}/commentaries/responses/${c._id}`);
                                  if (!res.ok) throw new Error(`HTTP ${res.status}`);
                                  const data = await res.json();
                                  setResponsesMap((s) => ({ ...s, [c._id]: data }));
                                  setShowResponses((s) => ({ ...s, [c._id]: true }));
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            >Afficher les réponses ({hasResponsesCount[c._id]})</button>
                          )}

                          {showResponses[c._id] && (
                            <div>
                              <button className="text-sm text-pink-600 hover:underline" onClick={() => setShowResponses((s) => ({ ...s, [c._id]: false }))}>Masquer les réponses</button>
                              <div className="mt-3 space-y-3">
                                {(responsesMap[c._id] || []).map((r) => (
                                  <div key={r._id} className="bg-white/60 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-pink-700">{displayName(r.userId)}</div>
                                    <div className="text-sm text-pink-600">{r.description}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex justify-end">
                            {!replyFormOpen[c._id] ? (
                              <button className="text-sm bg-pink-600 text-white px-3 py-1 rounded" onClick={() => setReplyFormOpen((s) => ({ ...s, [c._id]: true }))}>Répondre</button>
                            ) : (
                              <div className="w-full">
                                <textarea value={replyTextLocal[c._id] || ''} onChange={(e) => setReplyTextLocal((s) => ({ ...s, [c._id]: e.target.value }))} className="w-full border border-pink-200 rounded-md p-2 text-pink-300" placeholder="Répondre..." />
                                <div className="mt-2 flex gap-2 justify-end">
                                  <button className="px-3 py-1 bg-pink-100 text-pink-300 rounded" onClick={() => setReplyFormOpen((s) => ({ ...s, [c._id]: false }))} disabled={replyLoading[c._id]}>Annuler</button>
                                  <button className="px-3 py-1 bg-pink-600 text-white rounded" onClick={() => sendReply(c._id)} disabled={replyLoading[c._id]}>{replyLoading[c._id] ? 'Envoi...' : 'Répondre'}</button>
                                </div>
                                {replyErrorLocal[c._id] && <div className="text-sm text-red-600 mt-2">{replyErrorLocal[c._id]}</div>}
                              </div>
                            )}
                          </div>
                        </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
      <AddButton onCreate={(created) => {
        const c = { ...created };
          if (c.userId && typeof c.userId === 'string') {
            // insert optimistically; try to fetch user data to replace id later
            setCommentaries((prev) => [c, ...prev]);
            fetchUser(c.userId).then((u) => {
              if (!u) return;
              setCommentaries((prev) => prev.map(item => item._id === c._id ? { ...item, userId: u } : item));
            }).catch(() => null);
          } else {
            setCommentaries((prev) => [c, ...prev]);
          }
      }} />
    </main>
  )
}
