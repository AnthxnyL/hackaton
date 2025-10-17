"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AddButton from '../../components/addButton';

export default function CommentariesPage() {
  const [commentaries, setCommentaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [showResponses, setShowResponses] = useState({});
  const [responsesMap, setResponsesMap] = useState({});
  const [replyTextLocal, setReplyTextLocal] = useState({});
  const [hasResponsesCount, setHasResponsesCount] = useState({});
  const [replyFormOpen, setReplyFormOpen] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const [replyErrorLocal, setReplyErrorLocal] = useState({});

  useEffect(() => {
    const fetchCommentaries = async () => {
      setLoading(true);
      setError(null);
      try {
        // const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '')
        // const res = await fetch(`${apiBase}/commentaries`)
        const res = await fetch(
          `https://hackaton-back-delta.vercel.app/commentaries`
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCommentaries(data);
      } catch (err) {
        setError(err.message || "Erreur lors de la récupération");
      } finally {
        setLoading(false);
      }
    };

    fetchCommentaries();
  }, []);

  // fetch number of responses per comment (to know whether to show the 'Afficher les réponses' button)
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
      // update responses map and counts
      setResponsesMap((s) => ({ ...s, [parentId]: s[parentId] ? [created, ...s[parentId]] : [created] }));
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
              const user = c.userId || null;
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
                          alt={`${user.firstname} ${user.lastname} avatar`}
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
                            {user ? `${user.firstname} ${user.lastname}` : 'Utilisateur supprimé'}
                          </h2>
                          <div className="flex items-center gap-3 mt-1">
                            <time
                              dateTime={c.createdAt}
                              className="text-xs text-pink-800/80"
                              title={new Date(c.createdAt).toLocaleString()}
                            >
                              {new Date(c.createdAt).toLocaleString()}
                            </time>
                            {user && user.role && (
                              <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full">
                                {user.role}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          {user && (
                            <Link
                              href={`/pages/profile/${user._id}`}
                              className="text-pink-700 text-sm hover:underline"
                              aria-label={`Voir le profil de ${user.firstname} ${user.lastname}`}
                            >
                              Profil
                            </Link>
                          )}
                          {/* <button
                            type="button"
                            className="text-pink-700 text-sm hover:underline"
                            aria-label="Répondre au commentaire"
                          >
                            Répondre
                          </button> */}
                        </div>
                      </div>

                        <div className="mt-3 text-pink-600 text-sm md:text-base leading-relaxed">
                        <details className="group">
                          <summary className="list-none cursor-pointer select-none">
                            <span className="line-clamp-3 group-open:line-clamp-none">{c.description}</span>
                            <span className="ml-2 text-xs text-pink-700 underline">…</span>
                          </summary>
                          <div className="mt-2 text-pink-600">{c.description}</div>
                        </details>
                      </div>
                        {/* Responses area: show only if there are responses or when opened */}
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
                                    <div className="text-sm font-medium text-pink-700">{r.userId ? `${r.userId.firstname} ${r.userId.lastname}` : 'Utilisateur supprimé'}</div>
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
      <AddButton onCreate={(created) => setCommentaries((prev) => [
        // populate user lightly to match UI expectations
        { ...created, userId: { firstname: 'Vous', lastname: '', _id: 'me' } },
        ...prev
      ])} />
    </main>
  )
}
