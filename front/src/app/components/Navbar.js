"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Navbar() {
  const pathname = usePathname() || '/'

  const links = [
    { label: 'Accueil', href: '/' },
    { label: 'Commentaires', href: '/pages/commentaries' },
    { label: 'Profils', href: '/pages/profile' },
    { label: 'Connexion', href: '/pages/signin' },
    { label: 'Inscription', href: '/pages/signup' },
  ]

return (
    <nav className="relative w-full bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400/90 dark:from-pink-800 dark:via-pink-700 dark:to-pink-600/90 backdrop-blur-sm border-b border-pink-300/30 dark:border-pink-900/30 shadow-lg fade-in-down">
        <button
            type="button"
            aria-label="Go back"
            title="Go back"
            onClick={() => window.history.back()}
            className="absolute left-3 top-3 z-20 inline-flex items-center justify-center w-9 h-9 rounded-4xl bg-white/20 text-white hover:bg-white/50 focus:outline-none transition-transform duration-200 hover:-translate-x-1"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 logo-tilt">
                <div className="w-10 h-10 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center shadow-sm transition-transform duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2l2.9 6.26L21 9.27l-4.5 3.9L17.8 21 12 17.77 6.2 21l1.3-7.83L3 9.27l6.1-.01L12 2z" />
                    </svg>
                </div>
                <span className="text-white font-extrabold text-lg tracking-tight">Hackaton</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-3 bg-white/10 dark:bg-black/20 rounded-full px-3 py-1">
                {links.map((l, i) => {
                    const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
                    const base = isActive
                        ? 'bg-white/25 text-white font-semibold shadow-sm'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    return (
                        <Link
                            key={l.href}
                            href={l.href}
                            style={{ animationDelay: `${i * 70}ms` }}
                            className={`text-sm transition-all duration-200 px-3 py-2 rounded-md link-appear ${base}`}
                        >
                            {l.label}
                        </Link>
                    )
                })}
            </div>

            {/* Mobile menu (no JS state) */}
            <div className="md:hidden">
                <details className="relative">
                    <summary className="list-none cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 text-white transition-colors duration-150 hover:bg-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </summary>
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 rounded-lg shadow-lg overflow-hidden z-10 menu-slide">
                        {links.map((l, i) => {
                            const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    style={{ animationDelay: `${i * 60}ms` }}
                                    className={`block px-4 py-2 text-sm transition-colors duration-150 link-appear ${
                                        isActive ? 'bg-pink-100 text-pink-700 font-semibold' : 'text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-pink-900/40'
                                    }`}
                                >
                                    {l.label}
                                </Link>
                            )
                        })}
                    </div>
                </details>
            </div>
        </div>

        <style jsx>{`
            .fade-in-down {
                animation: fadeInDown 360ms ease both;
            }
            @keyframes fadeInDown {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .logo-tilt { transition: transform 220ms cubic-bezier(.2,.9,.3,1); }
            .logo-tilt:hover { transform: scale(1.06) rotate(-2deg); }

            .link-appear { opacity: 0; transform: translateY(-6px); animation: linkAppear 320ms ease forwards; }
            @keyframes linkAppear {
                to { opacity: 1; transform: translateY(0); }
            }

            .menu-slide { transform-origin: top right; animation: menuSlide 220ms cubic-bezier(.2,.9,.3,1) both; }
            @keyframes menuSlide {
                from { opacity: 0; transform: translateY(-6px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            /* Reduce motion respect */
            @media (prefers-reduced-motion: reduce) {
                .fade-in-down,
                .logo-tilt,
                .link-appear,
                .menu-slide {
                    animation: none !important;
                    transition: none !important;
                    transform: none !important;
                }
            }
        `}</style>
    </nav>
)
}
