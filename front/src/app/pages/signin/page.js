import React from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 p-8 w-full">
      <div className="relative w-full max-w-md rounded-3xl shadow-lg overflow-hidden">
        <div className="relative z-10 text-center bg-white bg-opacity-70 p-8 rounded-3xl">
          <h1 className="text-2xl font-semibold mb-4 text-pink-600">
            Se connecter
          </h1>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                name="pseudo"
                placeholder="Pseudo"
                className="w-full px-3 py-2 border rounded-2xl text-pink-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="motdepasse"
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
