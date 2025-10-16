"use client";
import React from "react";

export default function SignUpPage() {
  const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const hashPassword = async (password) => {
    const enc = new TextEncoder();
    const salt = (window.crypto || globalThis.crypto).getRandomValues(new Uint8Array(16));
    const keyMaterial = await (window.crypto || globalThis.crypto).subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derivedBits = await (window.crypto || globalThis.crypto).subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 150000,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    return {
      hash: arrayBufferToBase64(derivedBits),
      salt: arrayBufferToBase64(salt),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());

    let passwordHash, passwordSalt;
    try {
      const { hash, salt } = await hashPassword(formObj.password);
      passwordHash = hash;
      passwordSalt = salt;
    } catch (err) {
      console.error("Password hashing failed:", err);
      alert("Erreur lors du hachage du mot de passe.");
      return;
    }

    const payload = {
      firstname: formObj.firstname,
      lastname: formObj.lastname,
      email: formObj.email,
      password: passwordHash,
      salt: passwordSalt,
      address: formObj.address,
      description: formObj.description,
      phoneNumber: formObj.phoneNumber,
      avatar: formObj.avatar,
    };

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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
    <div className="min-h-screen flex items-center justify-center bg-pink-100 p-8 w-full">
      <div className="relative w-full max-w-md rounded-3xl shadow-lg overflow-hidden">
        <div className="relative z-10 text-center bg-white bg-opacity-70 p-8 rounded-3xl">
          <h1 className="text-2xl font-semibold mb-4 text-pink-600">
            Créer un compte
          </h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
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
                type="url"
                name="avatar"
                placeholder="URL de l'image (https://...)"
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
                type="password"
                name="password"
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
