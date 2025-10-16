"use client";

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation'

export default function ProfilePage() {
  const params = useParams()
  const id = params?.id || params?._id

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        // utilise l'API déployée fournie
        const res = await fetch(`https://hackaton-back-delta.vercel.app/users/${id}`);
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

  if (!id) return <div>Identifiant manquant dans l'URL</div>
  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>
  if (!user) return <div>Aucun utilisateur trouvé</div>

  return (
    <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-pink-600">Mon profil</h1>
        <p className="text-pink-400 italic">Voir toutes les informations de profil ici</p>
      </div>
      <div className="flex gap-4 bg-pink-700 p-8 rounded-3xl mt-4 justify-center">
        <div className="relative z-10 text-center bg-white bg-opacity-50 p-8 rounded-3xl">
          <h1 className="text-2xl font-semibold mb-4 text-pink-600">{user.firstname} {user.lastname}</h1>

          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-32 h-32 rounded-full mx-auto" />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto bg-pink-200 flex items-center justify-center">No avatar</div>
          )}
        </div>
        <div className="relative z-10 text-center bg-white bg-opacity-50 p-8 rounded-3xl">
          <h1 className="text-2xl font-semibold mb-4 text-pink-600">Informations et autres détails</h1>

          <div className="border-b-2 border-pink-400/50 pb-2 p-4">
            <p className="text-pink-800/60">Mon Rôle</p>
            <p className="text-pink-600">{user.role || '—'}</p>
          </div>
          <div className="border-b-2 border-pink-400/50 pb-2 p-4">
            <p className="text-pink-800/60">Ma Description</p>
            <p className="text-pink-600">{user.description || '—'}</p>
          </div>
          <div className="border-b-2 border-pink-400/50 pb-2 p-4">
            <p className="text-pink-800/60">Mon Email</p>
            <p className="text-pink-600">{user.email}</p>
          </div>
          <div className="border-b-2 border-pink-400/50 pb-2 p-4">
            <p className="text-pink-800/60">Mon Adresse</p>
            <p className="text-pink-600">{user.address || '—'}</p>
          </div>
          <div className="border-b-2 border-pink-400/50 pb-2 p-4">
            <p className="text-pink-800/60">Téléphone</p>
            <p className="text-pink-600">{user.phoneNumber || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
