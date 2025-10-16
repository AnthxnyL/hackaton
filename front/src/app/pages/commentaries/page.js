"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function CommentariesPage() {
  const [commentaries, setCommentaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const [replyError, setReplyError] = useState({});

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
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-pink-700">Commentaires</h1>
        <p className="text-sm text-pink-800/80 mt-2">
          {commentaries.length} commentaire{commentaries.length > 1 ? 's' : ''} • Derniers échanges
        </p>
      </header>

      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {commentaries.length === 0 ? (
          <div className="col-span-full bg-white/60 rounded-lg p-6 text-center text-pink-700">
            Aucun commentaire pour le moment.
          </div>
        ) : (
          commentaries.map((c) => {
            const user = c.userId || null
            const initials = user
              ? `${(user.firstname || '').charAt(0)}${(user.lastname || '').charAt(0)}`.toUpperCase()
              : 'U'

            return (
              <article
                key={c._id}
                className="bg-white/60 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                aria-labelledby={`comment-title-${c._id}`}
              >
                <div className="flex items-start gap-4">
                  {user && user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstname} ${user.lastname} avatar`}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-semibold">
                      {initials}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 id={`comment-title-${c._id}`} className="text-lg font-bold text-pink-900 truncate">
                          {user ? `${user.firstname} ${user.lastname}` : 'Utilisateur supprimé'}
                        </h2>
                        <time
                          dateTime={c.createdAt}
                          className="text-xs text-pink-800/80 block mt-1"
                          title={new Date(c.createdAt).toLocaleString()}
                        >
                          {new Date(c.createdAt).toLocaleString()}
                        </time>
                      </div>

                      <div className="flex items-center gap-3">
                        {user && (
                          <Link
                            href={`/profile/${user._id}`}
                            className="text-pink-700 text-sm italic hover:underline"
                            aria-label={`Voir le profil de ${user.firstname} ${user.lastname}`}
                          >
                            Voir profil
                          </Link>
                        )}
                        <button
                          type="button"
                          className="text-pink-700 text-sm italic opacity-90 hover:underline"
                          aria-label="Répondre au commentaire"
                        >
                          Répondre
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 text-pink-600 text-base leading-relaxed">
                      <details className="group">
                        <summary className="list-none cursor-pointer select-none">
                          <span className="line-clamp-3 group-open:line-clamp-none">{c.description}</span>
                          <span className="ml-2 text-xs text-pink-700 underline">…</span>
                        </summary>
                        <div className="mt-2 text-pink-600">{c.description}</div>
                      </details>
                    </div>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </section>
    </main>
  )
}
