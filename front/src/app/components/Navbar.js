"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Navbar() {
  const pathname = usePathname() || '/'

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Commentaries', href: '/pages/commentaries' },
    { label: 'Profile', href: '/pages/profile' },
    { label: 'Signin', href: '/pages/signin' },
    { label: 'Signup', href: '/pages/signup' },
  ]

  return (
    <nav className="w-full bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-pink-700">Hackaton</Link>

        <div className="hidden md:flex items-center gap-4">
          {links.map((l) => {
            const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link text-sm text-pink-700 ${isActive ? 'font-semibold underline' : 'opacity-95 hover:underline'}`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
