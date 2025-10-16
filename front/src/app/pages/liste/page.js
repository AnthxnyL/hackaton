export default function ListingPage() {
     return (
        <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
            <h1 className="text-3xl font-bold text-pink-600 mb-6">Statistiques des profils</h1>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <SmallStat label="Utilisateurs totaux" value={stats.total} />
                <SmallStat label="Adresses renseignées" value={stats.addresses} />
                <SmallStat label="Autres stats" value={Math.max(0, stats.total - stats.addresses)} />
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