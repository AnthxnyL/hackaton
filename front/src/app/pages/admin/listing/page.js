"use client";

import React, { useEffect, useMemo, useState } from "react";

function SmallStat({ label, value, hint }) {
    return (
        <div className="bg-white bg-opacity-60 p-4 rounded-xl flex flex-col items-center">
            <div className="text-sm text-pink-800/70">{label}</div>
            <div className="text-2xl font-bold text-pink-600">{value}</div>
            {hint && <div className="text-xs text-pink-500 mt-1">{hint}</div>}
        </div>
    );
}



function BarChart({ items = [], width = 300, height = 80 }) {
    if (!items.length) return <div className="text-sm text-pink-500">Aucun commentaire récent</div>;
    const max = Math.max(...items.map((i) => i.count), 1);
    const step = width / items.length;
    return (
        <svg width={width} height={height}>
            {items.map((it, idx) => {
                const w = step * 0.7;
                const x = idx * step + (step - w) / 2;
                const h = (it.count / max) * (height - 20);
                const y = height - h - 10;
                const parts = it._id ? it._id.split('-') : [];
                const label = parts.length === 3 ? `${parts[2]}/${parts[1]}` : (it._id?.slice(5) || '');
                return (
                    <g key={it._id || idx}>
                        <rect x={x} y={y} width={w} height={h} rx="3" fill="#F472B6" />
                        <text x={x + w / 2} y={height - 2} fontSize="10" textAnchor="middle" fill="#6b2135">{label}</text>
                    </g>
                );
            })}
        </svg>
    );
}


export default function Listing() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminStats, setAdminStats] = useState({});

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');


                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                // Fetch users (for list)
                const usersP = fetch(`${apiBase}/users`, { headers }).then(async (r) => {
                    if (!r.ok) throw new Error(`users: HTTP ${r.status}`);
                    const data = await r.json();
                    return Array.isArray(data) ? data : (data.users || []);
                }).catch(() => []);

                const totalP = fetch(`${apiBase}/admin/numbers`, { headers }).then(async (r) => {
                    if (!r.ok) throw new Error(`admin/numbers: HTTP ${r.status}`);
                    return await r.json();
                }).catch(() => null);

                const addressesP = fetch(`${apiBase}/admin/adresses`, { headers }).then(async (r) => {
                    if (!r.ok) throw new Error(`admin/adresses: HTTP ${r.status}`);
                    return await r.json();
                }).catch(() => null);

                const usersThisMonthP = fetch(`${apiBase}/admin/users-this-month`, { headers }).then(async (r) => {
                    if (!r.ok) throw new Error(`admin/users-this-month: HTTP ${r.status}`);
                    return await r.json();
                }).catch(() => null);

                const totalCommentsP = fetch(`${apiBase}/admin/total-comments`, { headers }).then(async (r) => {
                    if (!r.ok) throw new Error(`admin/total-comments: HTTP ${r.status}`);
                    return await r.json();
                }).catch(() => null);

                const commentsPerDayP = fetch(`${apiBase}/admin/comments-per-day`, { headers }).then(async (r) => {
                    if (!r.ok) throw new Error(`admin/comments-per-day: HTTP ${r.status}`);
                    return await r.json();
                }).catch(() => null);

                const [usersRes, totalRes, addressesRes, usersThisMonthRes, totalCommentsRes, commentsPerDayRes] = await Promise.all([
                    usersP, totalP, addressesP, usersThisMonthP, totalCommentsP, commentsPerDayP
                ]);

                setUsers(usersRes);
                setAdminStats({
                    totalUsers: typeof totalRes === 'number' ? totalRes : null,
                    addresses: typeof addressesRes === 'number' ? addressesRes : null,
                    usersThisMonth: typeof usersThisMonthRes === 'number' ? usersThisMonthRes : null,
                    totalComments: typeof totalCommentsRes === 'number' ? totalCommentsRes : null,
                    commentsPerDay: Array.isArray(commentsPerDayRes) ? commentsPerDayRes : null,
                });

            } catch (err) {
                setError(err.message || 'Erreur lors de la récupération des données');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const stats = useMemo(() => {
        const total = adminStats.totalUsers ?? users.length;
        let addressesCount = 0;
        users.forEach((u) => {
            if (u.address) addressesCount++;
        });
        const addresses = adminStats.addresses ?? addressesCount;
        return { total, addresses, usersThisMonth: adminStats.usersThisMonth, totalComments: adminStats.totalComments };
    }, [users, adminStats]);


    if (loading) return <div className="min-h-screen flex items-center justify-center bg-pink-100 p-8 w-full">Chargement...</div>;
    if (error) return <div className="p-6 text-red-600">Erreur: {error}</div>;


    return (
        <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
            <h1 className="text-3xl font-bold text-pink-600 mb-6">Statistiques des profils</h1>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <SmallStat label="Utilisateurs totaux" value={stats.total ?? 0} hint={stats.usersThisMonth ? `${stats.usersThisMonth} nouveaux ce mois` : ''} />
                <SmallStat label="Adresses renseignées" value={stats.addresses ?? 0} />
                <SmallStat label="Commentaires totaux" value={stats.totalComments ?? 0} />
            </div>

            <div className="flex gap-6 items-start">
                
                <div className="bg-white bg-opacity-60 p-6 rounded-2xl flex-1">
                    <h2 className="font-semibold text-pink-600 mb-4">Liste des profils</h2>
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-auto">
                        {users.map((u) => (
                            <div key={u._id || u.email} className="p-3 bg-white/60 rounded-lg border border-pink-200">
                                <div className="font-medium text-pink-700">{u.firstname} {u.lastname}</div>
                                <div className="text-xs text-pink-500">{u.email}</div>
                                <div className="text-xs text-pink-400">{u.address || '—'}</div>
                            </div>
                        ))}
                    </div>
                    {adminStats.commentsPerDay && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-pink-600 mb-2">Commentaires (7 derniers jours)</h3>
                            <BarChart items={adminStats.commentsPerDay} width={400} height={100} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
