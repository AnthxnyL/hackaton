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

function PieChart({ parts, size = 120 }) {
    // parts = [{ value, color }]
    const total = parts.reduce((s, p) => s + (p.value || 0), 0) || 1;
    let angle = 0;
    const arcs = parts.map((p, i) => {
        const start = angle;
        const sweep = ((p.value || 0) / total) * 360;
        angle += sweep;
        const large = sweep > 180 ? 1 : 0;
        const r = size / 2;
        const cx = r;
        const cy = r;
        const a0 = (start - 90) * (Math.PI / 180);
        const a1 = (start + sweep - 90) * (Math.PI / 180);
        const x0 = cx + r * Math.cos(a0);
        const y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const d = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
        return { d, color: p.color, key: i };
    });
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {arcs.map((a) => (
                <path key={a.key} d={a.d} fill={a.color} stroke="#fff" strokeWidth="1" />
            ))}
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

                // Fetch users (for list and gender distribution)
                const usersP = fetch(`${apiBase}/users`).then(async (r) => {
                    if (!r.ok) throw new Error(`users: HTTP ${r.status}`);
                    const data = await r.json();
                    return Array.isArray(data) ? data : (data.users || []);
                }).catch(() => []);

                // Fetch admin numbers (may be protected; fall back if not available)
                const totalP = fetch(`${apiBase}/admin/numbers`).then(async (r) => {
                    if (!r.ok) throw new Error(`admin/numbers: HTTP ${r.status}`);
                    return await r.json();
                }).catch(() => null);

                const addressesP = fetch(`${apiBase}/admin/adresses`).then(async (r) => {
                    if (!r.ok) throw new Error(`admin/adresses: HTTP ${r.status}`);
                    return await r.json();
                }).catch(() => null);

                const usersThisMonthP = fetch(`${apiBase}/admin/users-this-month`).then(async (r) => {
                    if (!r.ok) throw new Error(`admin/users-this-month: HTTP ${r.status}`);
                    return await r.json();
                }).catch(() => null);

                const totalCommentsP = fetch(`${apiBase}/admin/total-comments`).then(async (r) => {
                    if (!r.ok) throw new Error(`admin/total-comments: HTTP ${r.status}`);
                    return await r.json();
                }).catch(() => null);

                const [usersRes, totalRes, addressesRes, usersThisMonthRes, totalCommentsRes] = await Promise.all([
                    usersP, totalP, addressesP, usersThisMonthP, totalCommentsP
                ]);

                setUsers(usersRes);
                setAdminStats({
                    totalUsers: typeof totalRes === 'number' ? totalRes : null,
                    addresses: typeof addressesRes === 'number' ? addressesRes : null,
                    usersThisMonth: typeof usersThisMonthRes === 'number' ? usersThisMonthRes : null,
                    totalComments: typeof totalCommentsRes === 'number' ? totalCommentsRes : null,
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
        // prefer admin-provided totals when available
        const total = adminStats.totalUsers ?? users.length;
        const genders = { male: 0, female: 0, other: 0 };
        let addressesCount = 0;
        users.forEach((u) => {
            const g = (u.gender || u.sex || u.sGenre || '').toString().toLowerCase();
            if (g.includes('f')) genders.female++;
            else if (g.includes('m')) genders.male++;
            else genders.other++;
            if (u.address) addressesCount++;
        });
        // fallback to admin addresses if computed is 0
        const addresses = adminStats.addresses ?? addressesCount;
        return { total, genders, addresses, usersThisMonth: adminStats.usersThisMonth, totalComments: adminStats.totalComments };
    }, [users, adminStats]);

    const pieParts = [
        { value: stats.genders.male, color: '#60A5FA' },
        { value: stats.genders.female, color: '#F472B6' },
        { value: stats.genders.other, color: '#FBBF24' },
    ];

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
                <div className="bg-white bg-opacity-60 p-6 rounded-2xl">
                    <h2 className="font-semibold text-pink-600 mb-4">Répartition par genre</h2>
                    <div className="flex items-center gap-6">
                        <PieChart parts={pieParts} />
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#60A5FA] inline-block rounded-full"/> Homme: {stats.genders.male}</div>
                            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#F472B6] inline-block rounded-full"/> Femme: {stats.genders.female}</div>
                            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#FBBF24] inline-block rounded-full"/> Autre: {stats.genders.other}</div>
                        </div>
                    </div>
                </div>

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
                </div>
            </div>
        </div>
    );
}
