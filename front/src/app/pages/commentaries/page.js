"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AddButton from '../../components/addButton';

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
                          <button
                            type="button"
                            className="text-pink-700 text-sm hover:underline"
                            aria-label="Répondre au commentaire"
                          >
                            Répondre
                          </button>
                        </div>
                      </div>

                      {/* <div className="mt-3 text-pink-600 text-sm md:text-base leading-relaxed">
                        <details className="group">
                          <summary className="list-none cursor-pointer select-none">
                            <span className="line-clamp-3 group-open:line-clamp-none">{c.description}</span>
                            <span className="ml-2 text-xs text-pink-700 underline">…</span>
                          </summary>
                          <div className="mt-2 text-pink-600">{c.description}</div>
                        </details>
                      </div> */}
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
