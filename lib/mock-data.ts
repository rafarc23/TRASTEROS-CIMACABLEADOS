import type { Inquilino, Trastero } from "@/types"

export const createMockInquilinos = (): Inquilino[] => [
  {
    id: "inq_1",
    nombre: "Juan",
    apellidos: "García López",
    email: "juan.garcia@example.com",
    telefono: "666 123 456",
    fechaAlta: "2024-01-15",
  },
  {
    id: "inq_2",
    nombre: "María",
    apellidos: "Rodríguez Pérez",
    email: "maria.rodriguez@example.com",
    telefono: "677 234 567",
    fechaAlta: "2024-02-20",
  },
  {
    id: "inq_3",
    nombre: "Carlos",
    apellidos: "Martínez Sánchez",
    email: "carlos.martinez@example.com",
    telefono: "688 345 678",
    fechaAlta: "2024-03-10",
  },
]

export const updateTrasterosWithMockData = (trasteros: Trastero[]): Trastero[] => {
  // Asignar algunos trasteros a inquilinos de ejemplo
  const updated = [...trasteros]

  if (updated[0]) {
    updated[0] = {
      ...updated[0],
      inquilinoId: "inq_1",
      alCorrientePago: true,
      ultimoPago: "2024-12-01",
      proximoPago: "2025-01-01",
      llaves: {
        cantidad: 2,
        tipo: "Estándar",
        fechaEntrega: "2024-01-15",
      },
      codigoAlarma: "1234",
    }
  }

  if (updated[4]) {
    updated[4] = {
      ...updated[4],
      inquilinoId: "inq_2",
      alCorrientePago: false,
      ultimoPago: "2024-10-01",
      proximoPago: "2024-11-01",
      llaves: {
        cantidad: 1,
        tipo: "Estándar",
        fechaEntrega: "2024-02-20",
      },
      codigoAlarma: "5678",
    }
  }

  if (updated[9]) {
    updated[9] = {
      ...updated[9],
      inquilinoId: "inq_3",
      alCorrientePago: true,
      ultimoPago: "2024-12-10",
      proximoPago: "2025-01-10",
      llaves: {
        cantidad: 2,
        tipo: "Reforzada",
        fechaEntrega: "2024-03-10",
      },
      codigoAlarma: "9012",
    }
  }

  return updated
}
