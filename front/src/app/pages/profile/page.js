'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ProfileList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [authRequired, setAuthRequired] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app/').replace(/\/+$/, '');
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`${apiBase}/users`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        })
        if (!res.ok) {
          if (res.status === 401) {
            setAuthRequired(true)
            return
          }
          throw new Error(`HTTP ${res.status}`)
        }
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        setError(err.message || 'Erreur lors de la récupération')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return (
     <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
      <div className="font-bold mb-4 text-pink-600">Chargement...</div>
    </div>
  )
  if (authRequired) return (
    <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
      <div className="max-w-md mx-auto bg-white/80 p-8 rounded-2xl shadow">
        <h2 className="text-xl font-semibold text-pink-600 mb-2">Veuillez vous inscrire</h2>
        <p className="text-sm text-pink-700/80 mb-4">Pour accéder à la liste des utilisateurs, vous devez être connecté(e). Créez un compte pour continuer.</p>
        <div className="flex gap-3 justify-end">
          <button className="px-4 py-2 bg-pink-100 text-pink-600 rounded" onClick={() => window.location.href = '/pages/signin'}>Se connecter</button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded" onClick={() => window.location.href = '/pages/signup'}>S'inscrire</button>
        </div>
      </div>
    </div>
  )
  if (error) return <div>Erreur: {error}</div>

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-pink-100 to-white p-6">
      <div className="max-w-5xl mx-auto my-7 px-5 p-6 font-sans text-pink-700 dark:text-pink-200">
        <header className="flex items-baseline justify-between gap-4 mb-4">
          <div>
            <h1 className="m-0 text-lg font-bold text-pink-800">Liste des utilisateurs</h1>
            <p className="mt-1 text-sm text-pink-500">
              {users.length} utilisateur{users.length > 1 ? 's' : ''}
            </p>
          </div>
        </header>

        {users.length === 0 ? (
          <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-md">
            Aucun utilisateur trouvé.
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {users.map(user => {
              return (
                <Link
                  key={user._id}
                  href={`/pages/profile/${user._id}`}
                  className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-800 rounded-xl no-underline text-inherit shadow-sm ring-1 ring-pink-100 dark:ring-0 border border-transparent hover:-translate-y-1 transform transition"
                >
                  <img
                    src={user.avatar || user.avatarUrl || '/default-avatar.png'}
                    alt={`${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Avatar'}
                    className="min-w-[52px] w-[52px] h-[52px] rounded-full inline-flex items-center justify-center font-bold text-white text-base object-cover bg-gray-100"
                    loading="lazy"
                  />

                  <div className="flex-1 overflow-hidden">
                    <div className="font-semibold text-sm text-pink-700 dark:text-pink-100 truncate">
                      {user.firstname} {user.lastname}
                    </div>
                    {user.email && (
                      <div className="mt-1 text-xs text-pink-500 dark:text-pink-300 truncate">
                        {user.email}
                      </div>
                    )}
                  </div>

                  <div className="text-2xl text-pink-300 dark:text-pink-400" aria-hidden="true">
                    ›
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
