"use client";
import React from "react";

export default function SignInPage() {

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());

    const payload = {
      email: formObj.email,
      password: formObj.password,
    };
    console.log("Submitting sign-in with payload:", payload);
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
      const res = await fetch(`${apiBase}/auth/signin`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log("Received response:", res);
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
        console.log("Sign-in successful:", data);
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
        console.error("Sign-in failed:", data);
        alert(data?.message || "Erreur lors de la connexion.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      alert("Impossible de contacter le serveur. Réessayez plus tard.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 p-6">
      <div className="w-full max-w-4xl bg-white/60 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row fade-in">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 lg:p-12 fade-left">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-pink-600">
              Se connecter
            </h1>
            <p className="text-sm text-pink-500 mt-1">
              Entrez vos identifiants pour accéder à votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 stagger">
            <label className="block relative" style={{ ['--i']: '1' }}>
              <span className="sr-only">Email</span>
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-pink-400">
                {/* mail icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5v7a2.5 2.5 0 002.5 2.5h13A2.5 2.5 0 0021 15.5v-7M3 8.5l9 6 9-6M3 8.5V6a2.5 2.5 0 012.5-2.5h13A2.5 2.5 0 0121 6v2.5" />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full pl-11 pr-3 py-3 rounded-2xl border border-pink-200 bg-white/80 placeholder-pink-300 text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200 transition duration-200"
              />
            </label>

            <label className="block relative" style={{ ['--i']: '2' }}>
              <span className="sr-only">Mot de passe</span>
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-pink-400">
                {/* lock icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0-8a3 3 0 00-3 3v1h6v-1a3 3 0 00-3-3zm-5 6h10a2 2 0 002-2V9a4 4 0 10-8 0v2" />
                </svg>
              </span>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                required
                className="w-full pl-11 pr-3 py-3 rounded-2xl border border-pink-200 bg-white/80 placeholder-pink-300 text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200 transition duration-200"
              />
            </label>

            <button
              type="submit"
              style={{ ['--i']: '3' }}
              className="w-full inline-flex items-center justify-center gap-2 bg-pink-600 text-white py-3 rounded-3xl hover:bg-pink-700 active:scale-98 shadow-md transition transform motion-safe:hover:scale-105"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-pink-500">
            Pas encore de compte ?{" "}
            <a href="/pages/signup" className="text-pink-600 font-medium hover:underline">
              Inscription
            </a>
          </div>
        </div>

        {/* Right: Decorative / Responsive */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-tr from-pink-50 to-pink-100 p-6 fade-right">
          <div className="w-full max-w-sm text-center">
            <div className="mx-auto mb-6 w-40 h-40 rounded-full bg-pink-100 flex items-center justify-center shadow-inner pop">
              {/* subtle logo/illustration */}
              <svg className="w-20 h-20 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.5 0 4-1.5 4-4s-1.5-4-4-4-4 1.5-4 4 1.5 4 4 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-pink-600">Bienvenue</h3>
            <p className="mt-2 text-pink-500 text-sm">
              Accédez rapidement à votre tableau de bord et gérez vos informations.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Simple entrance animations with a subtle stagger */
        .fade-in { opacity: 0; animation: fadeIn 500ms ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }

        .fade-left { opacity: 0; animation: fadeLeft 700ms ease-out forwards; }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: none; }
        }

        .fade-right { opacity: 0; animation: fadeRight 700ms ease-out forwards; }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: none; }
        }

        .pop { opacity: 0; transform: scale(.96); animation: pop 600ms cubic-bezier(.2,.9,.2,1) forwards; }
        @keyframes pop {
          from { opacity: 0; transform: scale(.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .stagger > * {
          opacity: 0;
          transform: translateY(8px);
          animation: fadeUp 560ms cubic-bezier(.2,.9,.2,1) forwards;
          animation-delay: calc(var(--i, 1) * 80ms);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }

        /* Respect user preference for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .fade-in,
          .fade-left,
          .fade-right,
          .pop,
          .stagger > * {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
