import type { User, Inquilino, Trastero, Pago, Gasto } from "@/types"

const STORAGE_KEYS = {
  USERS: "storage_app_users",
  INQUILINOS: "storage_app_inquilinos",
  TRASTEROS: "storage_app_trasteros",
  PAGOS: "storage_app_pagos",
  GASTOS: "storage_app_gastos",
  CURRENT_USER: "storage_app_current_user",
  HISTORIAL_INQUILINOS: "storage_app_historial_inquilinos",
}

// Helper para trabajar con localStorage
const storage = {
  get: (key: string): any | null => {
    if (typeof window === "undefined") return null
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },
  set: (key: string, value: any): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key: string): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
  },
}

// Usuarios
export const getUsers = (): User[] => {
  return storage.get(STORAGE_KEYS.USERS) || []
}

export const saveUsers = (users: User[]): void => {
  storage.set(STORAGE_KEYS.USERS, users)
}

export const getCurrentUser = (): User | null => {
  return storage.get(STORAGE_KEYS.CURRENT_USER)
}

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    storage.set(STORAGE_KEYS.CURRENT_USER, user)
  } else {
    storage.remove(STORAGE_KEYS.CURRENT_USER)
  }
}

// Inquilinos
export const getInquilinos = (): Inquilino[] => {
  return storage.get(STORAGE_KEYS.INQUILINOS) || []
}

export const saveInquilinos = (inquilinos: Inquilino[]): void => {
  storage.set(STORAGE_KEYS.INQUILINOS, inquilinos)
}

export const addInquilino = (inquilino: Omit<Inquilino, "id">): Inquilino => {
  const inquilinos = getInquilinos()
  const newInquilino: Inquilino = {
    ...inquilino,
    id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }
  inquilinos.push(newInquilino)
  saveInquilinos(inquilinos)
  return newInquilino
}

export const updateInquilino = (id: string, data: Partial<Inquilino>): void => {
  const inquilinos = getInquilinos()
  const index = inquilinos.findIndex((i) => i.id === id)
  if (index !== -1) {
    inquilinos[index] = { ...inquilinos[index], ...data }
    saveInquilinos(inquilinos)
  }
}

export const deleteInquilino = (id: string): void => {
  const inquilinos = getInquilinos()
  saveInquilinos(inquilinos.filter((i) => i.id !== id))
}

// Historial de Inquilinos
export const getHistorialInquilinos = (): Inquilino[] => {
  return storage.get(STORAGE_KEYS.HISTORIAL_INQUILINOS) || []
}

export const saveHistorialInquilinos = (historial: Inquilino[]): void => {
  storage.set(STORAGE_KEYS.HISTORIAL_INQUILINOS, historial)
}

export const moverInquilinoAHistorial = (inquilino: Inquilino, trasteroNumero: number): void => {
  const historial = getHistorialInquilinos()
  const inquilinoConBaja: Inquilino = {
    ...inquilino,
    fechaBaja: new Date().toISOString().split("T")[0],
    trasteroNumero,
  }
  historial.push(inquilinoConBaja)
  saveHistorialInquilinos(historial)
}

// Trasteros
export const getTrasteros = (): Trastero[] => {
  return storage.get(STORAGE_KEYS.TRASTEROS) || []
}

export const saveTrasteros = (trasteros: Trastero[]): void => {
  storage.set(STORAGE_KEYS.TRASTEROS, trasteros)
}

export const updateTrastero = (id: string, data: Partial<Trastero>): void => {
  const trasteros = getTrasteros()
  const index = trasteros.findIndex((t) => t.id === id)
  if (index !== -1) {
    trasteros[index] = { ...trasteros[index], ...data }
    saveTrasteros(trasteros)
  }
}

// Pagos
export const getPagos = (): Pago[] => {
  return storage.get(STORAGE_KEYS.PAGOS) || []
}

export const savePagos = (pagos: Pago[]): void => {
  storage.set(STORAGE_KEYS.PAGOS, pagos)
}

export const addPago = (pago: Omit<Pago, "id">): Pago => {
  const pagos = getPagos()
  const newPago: Pago = {
    ...pago,
    id: `pago_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }
  pagos.push(newPago)
  savePagos(pagos)
  return newPago
}

// Gastos
export const getGastos = (): Gasto[] => {
  return storage.get(STORAGE_KEYS.GASTOS) || []
}

export const saveGastos = (gastos: Gasto[]): void => {
  storage.set(STORAGE_KEYS.GASTOS, gastos)
}

export const addGasto = (gasto: Omit<Gasto, "id">): Gasto => {
  const gastos = getGastos()
  const newGasto: Gasto = {
    ...gasto,
    id: `gasto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }
  gastos.push(newGasto)
  saveGastos(gastos)
  return newGasto
}

export const deleteGasto = (id: string): void => {
  const gastos = getGastos()
  saveGastos(gastos.filter((g) => g.id !== id))
}

// Inicializar datos
export const initializeData = (): void => {
  if (typeof window === "undefined") return

  // Solo inicializar si no hay datos
  if (!storage.get(STORAGE_KEYS.USERS)) {
    const defaultUsers: User[] = [
      {
        id: "user_1",
        email: "propietario@example.com",
        password: "admin123",
        role: "propietario",
        nombre: "Propietario",
      },
      {
        id: "user_2",
        email: "inmobiliaria@example.com",
        password: "inmob123",
        role: "inmobiliaria",
        nombre: "Inmobiliaria",
      },
      {
        id: "user_3",
        email: "admin@example.com",
        password: "admin123",
        role: "administrador",
        nombre: "Administrador",
      },
    ]
    saveUsers(defaultUsers)
  }

  if (!storage.get(STORAGE_KEYS.TRASTEROS)) {
    const trasteros: Trastero[] = Array.from({ length: 32 }, (_, i) => ({
      id: `trastero_${i + 1}`,
      numero: i + 1,
      inquilinoId: null,
      alCorrientePago: true,
      precioMensual: 50,
      llaves: {
        cantidad: 0,
        tipo: "Estándar",
      },
    }))
    saveTrasteros(trasteros)
  }

  if (!storage.get(STORAGE_KEYS.INQUILINOS)) {
    saveInquilinos([])
  }

  if (!storage.get(STORAGE_KEYS.PAGOS)) {
    savePagos([])
  }

  if (!storage.get(STORAGE_KEYS.GASTOS)) {
    const gastosEjemplo: Gasto[] = [
      {
        id: "gasto_1",
        fecha: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString().split("T")[0],
        concepto: "Mantenimiento sistema de alarma",
        monto: 120,
        categoria: "seguridad",
      },
      {
        id: "gasto_2",
        fecha: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString().split("T")[0],
        concepto: "Limpieza general de la nave",
        monto: 200,
        categoria: "limpieza",
      },
    ]
    saveGastos(gastosEjemplo)
  }

  if (!storage.get(STORAGE_KEYS.HISTORIAL_INQUILINOS)) {
    saveHistorialInquilinos([])
  }
}
