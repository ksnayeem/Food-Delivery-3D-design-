import React, { createContext, useContext, useState, useEffect } from 'react'
import type { UserRole } from '../types'

export interface UserProfile {
  id: string
  fullName: string
  email: string
  phone: string
  role: UserRole
  tier: string
  spicePoints: number
  address: string
  balconyPadEnabled: boolean
}

interface AuthContextType {
  user: UserProfile
  isProfileOpen: boolean
  setIsProfileOpen: (open: boolean) => void
  isAdminOpen: boolean
  setIsAdminOpen: (open: boolean) => void
  switchRole: (role: UserRole) => void
  updateAddress: (address: string, balconyPad: boolean) => void
}

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  CUSTOMER: {
    id: 'usr-customer-01',
    fullName: 'Gourmet Patron',
    email: 'customer@nayeemspices.com',
    phone: '+1 (555) 019-8234',
    role: 'CUSTOMER',
    tier: 'Diamond Connoisseur',
    spicePoints: 480,
    address: 'Skyline Tower, Suite 44B',
    balconyPadEnabled: true,
  },
  ADMIN: {
    id: 'usr-admin-01',
    fullName: 'Chef Nayeem (Executive)',
    email: 'admin@nayeemspices.com',
    phone: '+1 (555) 882-9900',
    role: 'ADMIN',
    tier: 'Platform Founder',
    spicePoints: 9999,
    address: 'Metropolis Culinary HQ, Penthouse 01',
    balconyPadEnabled: true,
  },
  CHEF: {
    id: 'usr-chef-01',
    fullName: 'Station 04 Plating Chef',
    email: 'chef@nayeemspices.com',
    phone: '+1 (555) 344-1290',
    role: 'CHEF',
    tier: 'Michelin Partner Chef',
    spicePoints: 1250,
    address: 'Kitchen Hub Station 04',
    balconyPadEnabled: true,
  },
  DISPATCHER: {
    id: 'usr-dispatcher-01',
    fullName: 'Fleet Radar Controller',
    email: 'dispatcher@nayeemspices.com',
    phone: '+1 (555) 776-4311',
    role: 'DISPATCHER',
    tier: 'Aeronav Supervisor',
    spicePoints: 850,
    address: 'Airways Flight Tower #09',
    balconyPadEnabled: true,
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USERS.CUSTOMER)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  useEffect(() => {
    const savedRole = localStorage.getItem('nayeem_spices_role') as UserRole
    if (savedRole && DEFAULT_USERS[savedRole]) {
      setUser(DEFAULT_USERS[savedRole])
    }
  }, [])

  const switchRole = (role: UserRole) => {
    if (DEFAULT_USERS[role]) {
      setUser(DEFAULT_USERS[role])
      localStorage.setItem('nayeem_spices_role', role)
    }
  }

  const updateAddress = (address: string, balconyPad: boolean) => {
    setUser((prev) => ({
      ...prev,
      address,
      balconyPadEnabled: balconyPad,
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isProfileOpen,
        setIsProfileOpen,
        isAdminOpen,
        setIsAdminOpen,
        switchRole,
        updateAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
