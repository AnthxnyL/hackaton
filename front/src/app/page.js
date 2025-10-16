import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-pink-100">
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-pink-600">
          Bienvenue sur notre application
        </h1>
        <div className="flex gap-3">
          <Link
            href="/pages/signup"
            className="bg-pink-600 font-bold text-white px-6 py-3 rounded-full hover:bg-pink-700 transition inline-flex items-center justify-center"
            aria-label="Aller à l'inscription"
          >
            Créer un compte
          </Link>
          <Link
            href="/pages/signin"
            className="bg-pink-600 font-bold text-white px-6 py-3 rounded-full hover:bg-pink-700 transition inline-flex items-center justify-center"
            aria-label="Aller à la connexion"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
