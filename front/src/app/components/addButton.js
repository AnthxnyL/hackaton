"use client";

import React, { useState } from 'react';

export default function AddButton({ onCreate }) {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const submit = async () => {
		if (!text.trim()) {
			setError('Le commentaire est vide');
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://hackaton-back-delta.vercel.app').replace(/\/+$/, '');
			const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
			const res = await fetch(`${apiBase}/commentaries`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify({ description: text }),
			});
			if (!res.ok) {
				const msg = await res.text().catch(() => res.statusText || 'Erreur');
				throw new Error(msg || `HTTP ${res.status}`);
			}
			const created = await res.json();
			setText('');
			setOpen(false);
			if (typeof onCreate === 'function') onCreate(created);
		} catch (err) {
			setError(err.message || 'Erreur lors de l’envoi');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				aria-label="Ajouter un commentaire"
				className="fixed right-6 bottom-6 z-40 bg-pink-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-700"
				onClick={() => setOpen(true)}
			>
				+
			</button>

			{open && (
				<div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
					<div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
					<div className="relative bg-white rounded-t-2xl md:rounded-2xl p-6 w-full md:w-2/3 max-w-2xl z-10">
						<h3 className="text-lg font-semibold text-pink-700 mb-3">Ajouter un commentaire</h3>
						<textarea
							className="w-full border border-pink-200 rounded-md p-3 min-h-[120px] text-gray-500"
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Écrire votre commentaire..."
						/>
						{error && <div className="text-red-600 mt-2">{error}</div>}
						<div className="mt-4 flex justify-end gap-3">
							<button className="px-4 py-2 bg-gray-400 rounded-md" onClick={() => setOpen(false)} disabled={loading}>Annuler</button>
							<button className="px-4 py-2 bg-pink-600 text-white rounded-md" onClick={submit} disabled={loading}>{loading ? 'Envoi...' : 'Envoyer'}</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
