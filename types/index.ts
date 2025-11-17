export type UserRole = "propietario" | "inmobiliaria" | "administrador"

export interface User {
  id: string
  email: string
  password: string
  role: UserRole
  nombre: string
}

export interface Inquilino {
  id: string
  nombre: string
  apellidos: string
  email?: string
  telefono?: string
  fechaAlta: string
  fechaBaja?: string // Para mantener referencia en el historial
  trasteroNumero?: number // Para mantener referencia en el historial
}

export interface Trastero {
  id: string
  numero: number
  inquilinoId: string | null
  alCorrientePago: boolean
  ultimoPago?: string
  proximoPago?: string
  precioMensual: number
  llaves: {
    cantidad: number
    tipo: string
    fechaEntrega?: string
  }
  codigoAlarma?: string
  notas?: string
}

export interface Pago {
  id: string
  trasteroId: string
  inquilinoId: string
  fecha: string
  monto: number
  concepto: string
  metodoPago: string
  mesPago: number // 1-12
  anioPago: number
}

export interface Gasto {
  id: string
  fecha: string
  concepto: string
  monto: number
  categoria: "mantenimiento" | "reparacion" | "limpieza" | "seguridad" | "impuestos" | "otros"
  notas?: string
}
