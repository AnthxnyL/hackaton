"use client"

import React, { useEffect, useState } from "react";
import Link from 'next/link'

export default function CommentariesPage() {
  const [commentaries, setCommentaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCommentaries = async () => {
      setLoading(true)
      setError(null)
      try {

        const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
        const res = await fetch(`${apiBase}/commentaries`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setCommentaries(data)
      } catch (err) {
        setError(err.message || 'Erreur lors de la récupération')
      } finally {
        setLoading(false)
      }
    }

    fetchCommentaries()
  }, [])

  if (loading) return (
    <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
      <div className="font-bold mb-4 text-pink-600">Chargement des commentaires...</div>
    </div>
)
  if (error) return <div>Erreur: {error}</div>

  return (
    <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
      <h1 className="text-3xl font-bold mb-4 text-pink-600">Commentaires</h1>
      <div className="space-y-4 p-10">
        {commentaries.map(c => (
          <div key={c._id} className="bg-pink-300/50 rounded p-4">
            <div className="flex items-center gap-3">
              {c.userId && c.userId.avatar ? (
                <img src={c.userId.avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-pink-200" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-pink-900">
                  {c.userId ? `${c.userId.firstname} ${c.userId.lastname}` : 'Utilisateur supprimé'}
                </h2>
                <p className="text-xs text-pink-800">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-pink-600 text-lg mt-3">{c.description}</p>
            <div className="mt-3 flex items-center gap-4">
              {c.userId && (
                <Link href={`/profile/${c.userId._id}`} className="text-pink-900 text-sm italic">Voir profil</Link>
              )}
              <button className="text-pink-900 text-xs italic">Répondre</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
