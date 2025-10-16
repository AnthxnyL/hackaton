 'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ProfileList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
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

  if (loading) return <div>Chargement des utilisateurs...</div>
  if (error) return <div>Erreur: {error}</div>

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      {users.length === 0 && <p>Aucun utilisateur trouvé.</p>}
      <ul>
        {users.map(user => (
          <li key={user._id} style={{marginBottom:12}}>
            <Link href={`/profile/${user._id}`} style={{textDecoration:'none',color:'#0366d6'}}>
              {user.firstname} {user.lastname} {user.email && `- ${user.email}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
