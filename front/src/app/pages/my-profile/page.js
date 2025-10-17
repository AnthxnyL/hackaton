"use client";

import React, { useEffect, useState } from "react";

export default function MyProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) throw new Error('Non connecté')
            
        let res = await fetch(`${apiBase}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          return;
        }

        res = await fetch(`${apiBase}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || data);
          return;
        }

        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            if (payload && (payload._id || payload.id || payload.sub)) {
              const id = payload._id || payload.id || payload.sub;
              const r2 = await fetch(`${apiBase}/users/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
              if (r2.ok) {
                const d2 = await r2.json();
                setUser(d2);
                return;
              }
            }
          }
        } catch (e) {
            // ignore decode errors
        }

        throw new Error('Impossible de récupérer les informations du profil');
      } catch (err) {
        setError(err.message || 'Erreur lors de la récupération');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) return (
    <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
      <div className="font-bold mb-4 text-pink-600">Chargement du profil...</div>
    </div>
  );
  if (error) return <div className="p-6">Erreur: {error}</div>;
  if (!user) return <div className="p-6">Aucun utilisateur connecté</div>;

  return (
    <div className="min-h-screen flex items-start justify-center bg-pink-100 p-6 sm:p-10 w-full">
      <div className="w-full max-w-5xl">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-pink-600">Mon profil</h1>
            <p className="mt-1 text-pink-400 italic">Informations de votre compte</p>
          </div>
          <div className="mt-2 sm:mt-0 text-sm text-pink-800/60">ID: <span className="font-medium text-pink-600">{user._id || user.id || '—'}</span></div>
        </header>

        <main className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </section>

          <section className="col-span-2 p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-pink-200/40 shadow-lg">
            <h3 className="text-lg font-semibold text-pink-600 mb-4">Informations et autres détails</h3>

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

              <div className="sm:col-span-2 p-4 rounded-lg bg-white/60 border border-pink-200/40">
                <p className="text-xs text-pink-800/60">Rôle détaillé</p>
                <p className="mt-1 text-pink-600">{user.roleDescription || user.role || '—'}</p>
              </div>

              <div className="sm:col-span-2 p-4 rounded-lg bg-white/60 border border-pink-200/40">
                <p className="text-xs text-pink-800/60">Autres informations</p>
                <p className="mt-1 text-pink-600">{user.otherInfo || '—'}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
