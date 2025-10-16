import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-pink-100 font-sans min-h-screen p-8 sm:p-20 flex flex-col items-center gap-12">
      <header className="w-full max-w-4xl flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pink-900">Hackathon Home</h1>
          <p className="text-sm text-pink-700">Welcome — choose where to go next</p>
        </div>
      </header>

        <main className="w-full max-w-4xl bg-pink-50/80 rounded-lg shadow-sm p-8 flex flex-col items-center gap-8">
          <p className="text-center text-pink-900 max-w-prose">
            This is the project homepage. Use the buttons below to navigate to sign in, sign up, view commentaries or browse profiles.
          </p>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/pages/signin"
              className="flex items-center justify-center rounded-lg font-medium px-4 py-3 transition transform motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:-translate-y-1 hover:scale-101 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-600 text-white hover:bg-pink-700"
            >
              Sign In
            </a>

            <a
              href="/pages/signup"
              className="flex items-center justify-center rounded-lg font-medium px-4 py-3 transition transform motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:-translate-y-1 hover:scale-101 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-600 text-white hover:bg-pink-700"
            >
              Sign Up
            </a>

            <a
              href="/pages/commentaries"
              className="flex items-center justify-center rounded-lg font-medium px-4 py-3 transition transform motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:-translate-y-1 hover:scale-101 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-600 text-white hover:bg-pink-700"
            >
              Commentaries
            </a>

            <a
              href="/pages/profiles"
              className="flex items-center justify-center rounded-lg font-medium px-4 py-3 transition transform motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:-translate-y-1 hover:scale-101 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-600 text-white hover:bg-pink-700"
            >
              Profiles
            </a>
          </div>
        </main>

      <footer className="w-full max-w-4xl text-center text-sm text-pink-700">
        Built for the hackathon — adjust routes (/signin, /signup, /commentaries, /profiles) to match your app.
      </footer>
    </div>
  );
}
