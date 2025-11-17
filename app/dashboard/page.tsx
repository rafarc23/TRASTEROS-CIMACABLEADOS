"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TrasteroCard } from "@/components/trastero-card"
import { EditTrasteroDialog } from "@/components/edit-trastero-dialog"
import { AddInquilinoDialog } from "@/components/add-inquilino-dialog"
import { RegistrarPagoDialog } from "@/components/registrar-pago-dialog"
import { BeneficiosChart } from "@/components/beneficios-chart"
import { HistorialTrasterosDialog } from "@/components/historial-trasteros-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  getTrasteros,
  getInquilinos,
  updateTrastero,
  addInquilino,
  saveTrasteros,
  saveInquilinos,
  getPagos,
  addPago,
  getGastos,
  addGasto,
  deleteGasto,
  getHistorialInquilinos,
  moverInquilinoAHistorial,
} from "@/lib/storage"
import { createMockInquilinos, updateTrasterosWithMockData } from "@/lib/mock-data"
import type { Trastero, Inquilino, Pago, Gasto } from "@/types"
import {
  Search,
  Plus,
  Building,
  Users,
  CheckCircle,
  XCircle,
  Euro,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Trash2,
} from "lucide-react"
import { AddGastoDialog } from "@/components/add-gasto-dialog"

export default function DashboardPage() {
  const { user } = useAuth()
  const [trasteros, setTrasteros] = useState<Trastero[]>([])
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [historialInquilinos, setHistorialInquilinos] = useState<Inquilino[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTrastero, setSelectedTrastero] = useState<Trastero | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addInquilinoDialogOpen, setAddInquilinoDialogOpen] = useState(false)
  const [pagoDialogOpen, setPagoDialogOpen] = useState(false)
  const [gastoDialogOpen, setGastoDialogOpen] = useState(false)
  const [selectedTrasteroForPago, setSelectedTrasteroForPago] = useState<Trastero | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      let loadedTrasteros = getTrasteros()
      let loadedInquilinos = getInquilinos()
      const loadedPagos = getPagos()
      const loadedGastos = getGastos()
      const loadedHistorial = getHistorialInquilinos()

      console.log("[v0] Datos cargados - Historial:", loadedHistorial.length, "inquilinos")
      console.log("[v0] Usuario actual:", user?.email, "Rol:", user?.role)

      if (loadedInquilinos.length === 0) {
        const mockInquilinos = createMockInquilinos()
        saveInquilinos(mockInquilinos)
        loadedInquilinos = mockInquilinos

        loadedTrasteros = updateTrasterosWithMockData(loadedTrasteros)
        saveTrasteros(loadedTrasteros)
      }

      setTrasteros(loadedTrasteros)
      setInquilinos(loadedInquilinos)
      setPagos(loadedPagos)
      setGastos(loadedGastos)
      setHistorialInquilinos(loadedHistorial)
      setInitialized(true)
    }
  }, [initialized])

  const handleEditTrastero = (trastero: Trastero) => {
    setSelectedTrastero(trastero)
    setEditDialogOpen(true)
  }

  const handleSaveTrastero = (updatedTrastero: Trastero, updatedInquilino?: Inquilino) => {
    updateTrastero(updatedTrastero.id, updatedTrastero)
    if (updatedInquilino) {
      const currentInquilinos = getInquilinos()
      const updatedInquilinos = currentInquilinos.map((i) => (i.id === updatedInquilino.id ? updatedInquilino : i))
      saveInquilinos(updatedInquilinos)
      setInquilinos(updatedInquilinos)
    }
    setTrasteros(getTrasteros())
  }

  const handleRemoveInquilino = (trastero: Trastero) => {
    if (!trastero.inquilinoId) return

    const inquilino = inquilinos.find((i) => i.id === trastero.inquilinoId)
    if (inquilino) {
      moverInquilinoAHistorial(inquilino, trastero.numero)
      setHistorialInquilinos(getHistorialInquilinos())
    }

    const updated = {
      ...trastero,
      inquilinoId: null,
      codigoAlarma: undefined,
      llaves: { cantidad: 0, tipo: "Estándar" },
    }
    updateTrastero(trastero.id, updated)
    setTrasteros(getTrasteros())
  }

  const handleAddInquilino = (inquilino: Omit<Inquilino, "id">) => {
    addInquilino(inquilino)
    setInquilinos(getInquilinos())
  }

  const handleRegistrarPago = (pago: Omit<Pago, "id">) => {
    addPago(pago)
    setPagos(getPagos())

    const trastero = trasteros.find((t) => t.id === pago.trasteroId)
    if (trastero) {
      const today = new Date()
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())

      updateTrastero(trastero.id, {
        alCorrientePago: true,
        ultimoPago: pago.fecha,
        proximoPago: nextMonth.toISOString().split("T")[0],
      })
      setTrasteros(getTrasteros())
    }
  }

  const handleOpenPagoDialog = (trastero: Trastero) => {
    setSelectedTrasteroForPago(trastero)
    setPagoDialogOpen(true)
  }

  const handleAddGasto = (gasto: Omit<Gasto, "id">) => {
    addGasto(gasto)
    setGastos(getGastos())
  }

  const handleDeleteGasto = (gastoId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este gasto?")) {
      deleteGasto(gastoId)
      setGastos(getGastos())
    }
  }

  const getInquilinoById = (id: string | null) => {
    if (!id) return undefined
    return inquilinos.find((inq) => inq.id === id)
  }

  const filteredTrasteros = trasteros.filter((t) => {
    if (!searchTerm) return true
    const inquilino = getInquilinoById(t.inquilinoId)
    const searchLower = searchTerm.toLowerCase()
    return (
      t.numero.toString().includes(searchLower) ||
      inquilino?.nombre.toLowerCase().includes(searchLower) ||
      inquilino?.apellidos.toLowerCase().includes(searchLower)
    )
  })

  const ocupados = filteredTrasteros.filter((t) => t.inquilinoId)
  const disponibles = filteredTrasteros.filter((t) => !t.inquilinoId)
  const alCorriente = ocupados.filter((t) => t.alCorrientePago)
  const pendientes = ocupados.filter((t) => !t.alCorrientePago)

  const totalIngresos = pagos.reduce((sum, p) => sum + p.monto, 0)

  const hoy = new Date()
  const mesActual = hoy.getMonth() + 1
  const anioActual = hoy.getFullYear()

  const ingresosMesActual = pagos
    .filter((p) => p.mesPago === mesActual && p.anioPago === anioActual)
    .reduce((sum, p) => sum + p.monto, 0)

  const ingresosEsperadosMes = ocupados.reduce((sum, t) => sum + t.precioMensual, 0)

  const gastosMesActual = gastos
    .filter((g) => {
      const fecha = new Date(g.fecha)
      return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual
    })
    .reduce((sum, g) => sum + g.monto, 0)

  const beneficioMesActual = ingresosEsperadosMes - gastosMesActual
  const tasaOcupacion = trasteros.length > 0 ? (ocupados.length / trasteros.length) * 100 : 0
  const ingresosPotenciales = trasteros.reduce((sum, t) => sum + t.precioMensual, 0)

  const ingresosEsperadosPorMes: { mes: number; anio: number; monto: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
    const mes = fecha.getMonth() + 1
    const anio = fecha.getFullYear()

    const trasterosOcupadosEnMes = trasteros.filter((t) => {
      if (!t.inquilinoId) return false
      const inquilino = inquilinos.find((i) => i.id === t.inquilinoId)
      if (!inquilino?.fechaAlta) return false
      const fechaAlta = new Date(inquilino.fechaAlta)
      const fechaMes = new Date(anio, mes - 1, 1)
      return fechaAlta <= fechaMes
    })

    const monto = trasterosOcupadosEnMes.reduce((sum, t) => sum + t.precioMensual, 0)
    ingresosEsperadosPorMes.push({ mes, anio, monto })
  }

  const stats = [
    {
      title: "Total Trasteros",
      value: trasteros.length,
      icon: Building,
      color: "text-blue-600",
    },
    {
      title: "Ocupados",
      value: ocupados.length,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Al corriente",
      value: alCorriente.length,
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    {
      title: "Pagos pendientes",
      value: pendientes.length,
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  const isAdministrador = user?.role === "administrador"
  const isPropietario = user?.role === "propietario"

  return (
    <ProtectedRoute>
      <DashboardLayout
        title={`Panel de ${user?.role === "propietario" ? "Propietario" : user?.role === "inmobiliaria" ? "Inmobiliaria" : "Administrador"}`}
      >
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {isPropietario && (
            <>
              <Card className="border-2 border-red-600/30 bg-gradient-to-br from-background to-red-50/40 dark:to-red-950/20 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">Resumen Financiero</CardTitle>
                      <CardDescription className="font-semibold">
                        {new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setGastoDialogOpen(true)}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 font-semibold shadow-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir gasto
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-background rounded-lg p-4 border-2 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-muted-foreground">Ingresos del mes</span>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{ingresosEsperadosMes.toFixed(2)}€</div>
                      <p className="text-xs font-semibold text-muted-foreground mt-1">
                        {ocupados.length} trasteros ocupados
                      </p>
                      {ingresosMesActual !== ingresosEsperadosMes && (
                        <p className="text-xs text-amber-600 font-semibold mt-1">
                          Registrados: {ingresosMesActual.toFixed(2)}€
                        </p>
                      )}
                    </div>

                    <div className="bg-background rounded-lg p-4 border-2 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-muted-foreground">Gastos del mes</span>
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-red-600">{gastosMesActual.toFixed(2)}€</div>
                      <p className="text-xs font-semibold text-muted-foreground mt-1">
                        {
                          gastos.filter((g) => {
                            const fecha = new Date(g.fecha)
                            return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual
                          }).length
                        }{" "}
                        gastos registrados
                      </p>
                    </div>

                    <div className="bg-background rounded-lg p-4 border-2 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-muted-foreground">Beneficio neto</span>
                        <Wallet className="h-5 w-5 text-blue-600" />
                      </div>
                      <div
                        className={`text-2xl font-bold ${beneficioMesActual >= 0 ? "text-blue-600" : "text-red-600"}`}
                      >
                        {beneficioMesActual.toFixed(2)}€
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground mt-1">
                        {beneficioMesActual >= 0 ? "Beneficio positivo" : "Pérdidas este mes"}
                      </p>
                    </div>

                    <div className="bg-background rounded-lg p-4 border-2 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-muted-foreground">Tasa de ocupación</span>
                        <Building className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{tasaOcupacion.toFixed(1)}%</div>
                      <p className="text-xs font-semibold text-muted-foreground mt-1">
                        Potencial: {ingresosPotenciales.toFixed(0)}€/mes
                      </p>
                    </div>
                  </div>

                  {gastos.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-bold mb-3">Últimos gastos</h4>
                      <div className="space-y-2">
                        {gastos
                          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                          .slice(0, 5)
                          .map((gasto) => (
                            <div
                              key={gasto.id}
                              className="flex items-center justify-between p-3 bg-background border-2 rounded-lg shadow-sm"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{gasto.concepto}</span>
                                  <Badge variant="outline" className="capitalize font-semibold">
                                    {gasto.categoria}
                                  </Badge>
                                </div>
                                <p className="text-xs font-semibold text-muted-foreground mt-1">
                                  {new Date(gasto.fecha).toLocaleDateString("es-ES")}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="font-bold text-red-600">{gasto.monto.toFixed(2)}€</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteGasto(gasto.id)}
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <BeneficiosChart pagos={pagos} gastos={gastos} ingresosEsperadosPorMes={ingresosEsperadosPorMes} />
            </>
          )}

          {isAdministrador && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos totales</CardTitle>
                  <Euro className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalIngresos.toFixed(2)}€</div>
                  <p className="text-xs text-muted-foreground mt-1">Desde el inicio</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos este mes</CardTitle>
                  <Calendar className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ingresosMesActual.toFixed(2)}€</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número o inquilino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              {isPropietario && <HistorialTrasterosDialog historial={historialInquilinos} />}
              {!isAdministrador && (
                <Button onClick={() => setAddInquilinoDialogOpen(true)} className="shadow-sm font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir inquilino
                </Button>
              )}
            </div>
          </div>

          {isAdministrador && pendientes.length > 0 && (
            <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-900 dark:text-red-100">Pagos pendientes</CardTitle>
                <CardDescription>Trasteros con pagos atrasados que requieren atención</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendientes.map((trastero) => {
                    const inquilino = getInquilinoById(trastero.inquilinoId)
                    return (
                      <div
                        key={trastero.id}
                        className="flex items-center justify-between p-3 bg-background rounded-lg border"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Trastero #{trastero.numero}</span>
                            <Badge variant="destructive">Pendiente</Badge>
                          </div>
                          {inquilino && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {inquilino.nombre} {inquilino.apellidos}
                            </p>
                          )}
                          {trastero.ultimoPago && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Último pago: {new Date(trastero.ultimoPago).toLocaleDateString("es-ES")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold">{trastero.precioMensual}€</p>
                            <p className="text-xs text-muted-foreground">mensual</p>
                          </div>
                          <Button size="sm" onClick={() => handleOpenPagoDialog(trastero)}>
                            Registrar pago
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {isAdministrador && pagos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historial de pagos</CardTitle>
                <CardDescription>Últimos pagos registrados en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pagos
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .slice(0, 10)
                    .map((pago) => {
                      const trastero = trasteros.find((t) => t.id === pago.trasteroId)
                      const inquilino = inquilinos.find((i) => i.id === pago.inquilinoId)
                      return (
                        <div key={pago.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Trastero #{trastero?.numero}</span>
                              <span className="text-sm text-muted-foreground">
                                {inquilino?.nombre} {inquilino?.apellidos}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{pago.concepto}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{pago.monto.toFixed(2)}€</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(pago.fecha).toLocaleDateString("es-ES")}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">{pago.metodoPago}</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trasteros */}
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="grid w-full grid-cols-4 shadow-sm">
              <TabsTrigger value="todos" className="font-semibold">
                Todos ({filteredTrasteros.length})
              </TabsTrigger>
              <TabsTrigger value="ocupados" className="font-semibold">
                Ocupados ({ocupados.length})
              </TabsTrigger>
              <TabsTrigger value="disponibles" className="font-semibold">
                Disponibles ({disponibles.length})
              </TabsTrigger>
              <TabsTrigger value="pendientes" className="font-semibold">
                Pendientes ({pendientes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTrasteros.map((trastero) => (
                  <TrasteroCard
                    key={trastero.id}
                    trastero={trastero}
                    inquilino={getInquilinoById(trastero.inquilinoId)}
                    onEdit={!isAdministrador ? handleEditTrastero : undefined}
                    onRemoveInquilino={!isAdministrador ? handleRemoveInquilino : undefined}
                    showActions={!isAdministrador}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ocupados" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {ocupados.map((trastero) => (
                  <TrasteroCard
                    key={trastero.id}
                    trastero={trastero}
                    inquilino={getInquilinoById(trastero.inquilinoId)}
                    onEdit={!isAdministrador ? handleEditTrastero : undefined}
                    onRemoveInquilino={!isAdministrador ? handleRemoveInquilino : undefined}
                    showActions={!isAdministrador}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="disponibles" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {disponibles.map((trastero) => (
                  <TrasteroCard
                    key={trastero.id}
                    trastero={trastero}
                    onEdit={!isAdministrador ? handleEditTrastero : undefined}
                    showActions={!isAdministrador}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pendientes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pendientes.map((trastero) => (
                  <TrasteroCard
                    key={trastero.id}
                    trastero={trastero}
                    inquilino={getInquilinoById(trastero.inquilinoId)}
                    onEdit={!isAdministrador ? handleEditTrastero : undefined}
                    onRemoveInquilino={!isAdministrador ? handleRemoveInquilino : undefined}
                    showActions={!isAdministrador}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <EditTrasteroDialog
          trastero={selectedTrastero}
          inquilinos={inquilinos}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveTrastero}
        />

        <AddInquilinoDialog
          open={addInquilinoDialogOpen}
          onOpenChange={setAddInquilinoDialogOpen}
          onAdd={handleAddInquilino}
        />

        <RegistrarPagoDialog
          trastero={selectedTrasteroForPago}
          inquilino={selectedTrasteroForPago ? getInquilinoById(selectedTrasteroForPago.inquilinoId) : null}
          open={pagoDialogOpen}
          onOpenChange={setPagoDialogOpen}
          onRegistrar={handleRegistrarPago}
        />

        <AddGastoDialog open={gastoDialogOpen} onOpenChange={setGastoDialogOpen} onAdd={handleAddGasto} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
