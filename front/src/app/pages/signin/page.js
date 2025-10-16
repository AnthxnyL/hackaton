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
        alert("Connexion réussie.");
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
    <div className="min-h-screen flex items-center justify-center bg-pink-100 p-8 w-full">
      <div className="relative w-full max-w-md rounded-3xl shadow-lg overflow-hidden">
        <div className="relative z-10 text-center bg-white bg-opacity-70 p-8 rounded-3xl">
          <h1 className="text-2xl font-semibold mb-4 text-pink-600">
            Se connecter
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-2xl text-pink-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                className="w-full px-3 py-2 border rounded-2xl text-pink-400"
                required
              />
            </div>
            <div>
              <a href="#" className="text-sm text-pink-600 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded-3xl hover:bg-pink-700"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
