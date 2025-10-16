"use client";

import React from "react";
import { useState, useEffect } from "react";
import { User } from "../../../models/usersModel";

export default function ProfilePage() {
const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data from API or context
        const fetchUser = async () => {
            const response = await User.findById(userId);
            setUser(response);
        };
        fetchUser();
    }, []);

  return (
    <div className="min-h-screen items-center justify-center bg-pink-100 p-8 w-full">
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-pink-600">
          Mon profil
        </h1>
        <p className="text-pink-400 italic">
          Voir toutes les informations de profil ici
        </p>
      </div>
      <div className="flex gap-4 bg-pink-700 p-8 rounded-3xl mt-4 justify-center">
        <div className="relative z-10 text-center bg-white bg-opacity-50 p-8 rounded-3xl">
          <h1 className="text-2xl font-semibold mb-4 text-pink-600">Name</h1>
          {/* <h1 className="text-2xl font-semibold mb-4 text-pink-600">{user.firstname}{user.lastname}</h1> */}

          <img
            src="profile.jpg"
            alt="Profile Picture"
            className="w-32 h-32 rounded-full mx-auto"
          />
          {/* user.avatar */}
        </div>
        <div className="relative z-10 text-center bg-white bg-opacity-50 p-8 rounded-3xl">
          <h1 className="text-2xl font-semibold mb-4 text-pink-600">
            Informations et autres détails
          </h1>
          <div className="border-b-2 border-pink-400/50 pb-2 p-4">
            <p className="text-pink-800/60">Mon Rôle</p>
            <p className="text-pink-600">rôle</p>
            {/* <p className="text-pink-600">{User.role}</p> */}
          </div>
          <div className="border-b-2 border-pink-400/50 pb-2 p-4">
            <p className="text-pink-800/60">Ma Description</p>
            <p className="text-pink-600">Ceci est une description.</p>
            {/* <p className="text-pink-600">{User.description}</p> */}
          </div>
          <div className="border-b-2 border-pink-400/50 pb-2 p-4">
            <p className="text-pink-800/60">Mon Email</p>
            <p className="text-pink-600">email@example.com</p>
            {/* <p className="text-pink-600">{User.email}</p> */}
          </div>
          <div className="border-b-2 border-pink-400/50 pb-2 p-4">
            <p className="text-pink-800/60">Mon Adresse</p>
            <p className="text-pink-600">Adresse</p>
            {/* <p className="text-pink-600">{User.address}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
