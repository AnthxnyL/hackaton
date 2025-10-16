"use client";
import React from "react";

export default function SignUpPage() {

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());

    const payload = {
      firstname: formObj.firstname,
      lastname: formObj.lastname,
      email: formObj.email,
      password: formObj.password,
      address: formObj.address,
      description: formObj.description,
      phoneNumber: formObj.phoneNumber,
      avatar: formObj.avatar,
    };

    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
      const res = await fetch(`${apiBase}/users`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response from API:', text);
        alert('Erreur serveur: voir la console pour plus de détails.');
        return;
      }

      if (res.ok) {
        form.reset();
        alert("Compte créé avec succès.");
        try {
          if (data && data.token) {
            localStorage.setItem('token', data.token);
          }
        } catch (e) {
          console.warn('Could not access localStorage to save token', e);
        }
        try {
          window.location.replace('/pages/profile/' + data.user._id);
        } catch (e) {
          console.error('Redirect to /profile failed', e);
        }
      } else {
        console.error("Sign-up failed:", data);
        alert(data?.message || "Erreur lors de la création du compte.");
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      alert("Impossible de contacter le serveur. Réessayez plus tard.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-pink-100 to-white p-6">
      <div className="w-full max-w-4xl bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transform transition-transform hover:scale-[1.01] will-change-transform">
        {/* Left visual / branding column */}
        <div className="hidden md:flex flex-col justify-center items-start gap-4 p-10 bg-gradient-to-b from-pink-100 to-pink-50 animate-left">
          <h1 className="text-3xl font-extrabold text-pink-600">Bienvenue ✨</h1>
          <p className="text-pink-500/90">
            Créez votre compte pour accéder à votre profil. Simple, rapide et sécurisé.
          </p>
          <div className="mt-4 w-full rounded-xl overflow-hidden">
            {/* subtle decorative panel */}
            <div className="w-full h-40 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-200/50 to-white/0 panel-float" />
          </div>
        </div>

        {/* Form column */}
        <div className="p-6 md:p-10">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold text-pink-600 mb-2 fade-in delayed-1">Créer un compte</h2>
            <p className="text-sm text-pink-500 mb-6 fade-in delayed-2">
              Renseignez vos informations pour commencer.
            </p>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 form-stack">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 form-field">
                <label className="block">
                  <span className="sr-only">Prénom</span>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="Prénom"
                    className="w-full px-4 py-3 rounded-xl border border-transparent bg-white/80 placeholder-pink-300 text-pink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition transform hover:-translate-y-0.5"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">Nom</span>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Nom"
                    className="w-full px-4 py-3 rounded-xl border border-transparent bg-white/80 placeholder-pink-300 text-pink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition transform hover:-translate-y-0.5"
                  />
                </label>
              </div>

              <label className="block form-field">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-transparent bg-white/80 placeholder-pink-300 text-pink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition transform hover:-translate-y-0.5"
                />
              </label>

              <label className="block form-field">
                <span className="sr-only">Avatar URL</span>
                <input
                  type="url"
                  name="avatar"
                  placeholder="URL de l'image (https://...)"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-transparent bg-white/80 placeholder-pink-300 text-pink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition transform hover:-translate-y-0.5"
                />
                <p className="text-xs text-pink-400 mt-1">URL publique de votre avatar (optionnel)</p>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 form-field">
                <label className="block">
                  <span className="sr-only">Adresse</span>
                  <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-transparent bg-white/80 placeholder-pink-300 text-pink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition transform hover:-translate-y-0.5"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">Téléphone</span>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Numéro de téléphone"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-transparent bg-white/80 placeholder-pink-300 text-pink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition transform hover:-translate-y-0.5"
                  />
                </label>
              </div>

              <label className="block form-field">
                <span className="sr-only">Description</span>
                <textarea
                  name="description"
                  placeholder="Description"
                  required
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-transparent bg-white/80 placeholder-pink-300 text-pink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition resize-none transform hover:-translate-y-0.5"
                />
              </label>

              <label className="block form-field">
                <span className="sr-only">Mot de passe</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-transparent bg-white/80 placeholder-pink-300 text-pink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition transform hover:-translate-y-0.5"
                />
              </label>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold rounded-2xl shadow hover:from-pink-700 hover:to-pink-600 transition transform hover:-translate-y-0.5 active:translate-y-0.5 focus:outline-none form-cta"
              >
                Créer un compte
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-pink-500 fade-in delayed-3">
              Déjà un compte ?{" "}
              <a href="/pages/signin" className="text-pink-600 font-medium hover:underline">
                Connexion
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(6px);
          animation: fadeUp 420ms ease forwards;
        }
        .delayed-1 { animation-delay: 80ms; }
        .delayed-2 { animation-delay: 160ms; }
        .delayed-3 { animation-delay: 240ms; }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .form-stack > * {
          opacity: 0;
          transform: translateY(8px);
          animation: fadeUp 420ms ease forwards;
        }
        .form-stack > :nth-child(1) { animation-delay: 120ms; }
        .form-stack > :nth-child(2) { animation-delay: 180ms; }
        .form-stack > :nth-child(3) { animation-delay: 240ms; }
        .form-stack > :nth-child(4) { animation-delay: 300ms; }
        .form-stack > :nth-child(5) { animation-delay: 360ms; }
        .form-stack > :nth-child(6) { animation-delay: 420ms; }
        .form-stack > :nth-child(7) { animation-delay: 480ms; }

        .animate-left { opacity: 0; transform: translateX(-12px); animation: slideInLeft 520ms ease forwards 100ms; }
        @keyframes slideInLeft { to { opacity: 1; transform: translateX(0); } }

        .panel-float {
          animation: floaty 6s ease-in-out infinite;
        }
        @keyframes floaty {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-0.2deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        .form-cta {
          animation: pulseSoft 4.5s ease-in-out infinite;
        }
        @keyframes pulseSoft {
          0%, 100% { transform: translateY(0); box-shadow: 0 10px 20px rgba(219,39,119,0.08); }
          50% { transform: translateY(-2px); box-shadow: 0 18px 36px rgba(219,39,119,0.12); }
        }
      `}</style>
    </div>
  );
}
