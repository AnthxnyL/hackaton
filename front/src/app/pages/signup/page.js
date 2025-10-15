import React from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 p-8 w-full">
      <div className="relative w-full max-w-md rounded-3xl shadow-lg overflow-hidden">
        <div className="relative z-10 text-center bg-white bg-opacity-70 p-8 rounded-3xl">
          <h1 className="text-2xl font-semibold mb-4 text-pink-600">
            Créer un compte
          </h1>
          <form className="space-y-4">
            <div className="flex gap-2">
              <div>
                <input
                  type="text"
                  name="firstname"
                  placeholder="Prénom"
                  className="w-full px-3 py-2 border rounded-2xl text-pink-400"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Nom"
                  className="w-full px-3 py-2 border rounded-2xl text-pink-400"
                  required
                />
              </div>
            </div>
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
                type="file"
                name="avatar"
                placeholder="Avatar"
                className="w-full px-3 py-2 border rounded-2xl text-pink-400"
                required
              />
            </div>
            <div className="flex gap-2">
              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Adresse"
                  className="w-full px-3 py-2 border rounded-2xl text-pink-400"
                  required
                />
              </div>
               <div>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Numéro de téléphone"
                  className="w-full px-3 py-2 border rounded-2xl text-pink-400"
                  required
                />
              </div>
            </div>
            <div>
              <input
                type="text"
                name="description"
                placeholder="Description"
                className="w-full px-3 py-2 border rounded-2xl text-pink-400"
                required
              />
            </div>
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
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded-3xl hover:bg-pink-700"
            >
              Créer un compte
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
