"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Trastero, Inquilino } from "@/types"
import { CheckCircle2, XCircle, Key, Shield, Edit, UserX } from "lucide-react"

interface TrasteroCardProps {
  trastero: Trastero
  inquilino?: Inquilino
  onEdit?: (trastero: Trastero) => void
  onRemoveInquilino?: (trastero: Trastero) => void
  showActions?: boolean
}

export function TrasteroCard({
  trastero,
  inquilino,
  onEdit,
  onRemoveInquilino,
  showActions = true,
}: TrasteroCardProps) {
  const isOcupado = !!trastero.inquilinoId

  return (
    <Card className={`${isOcupado ? "border-primary/50 shadow-md" : "shadow-sm"} hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Trastero #{trastero.numero}</CardTitle>
            <Badge
              variant={isOcupado ? "default" : "secondary"}
              className={`mt-2 font-semibold ${isOcupado ? "bg-primary text-primary-foreground" : ""}`}
            >
              {isOcupado ? "Ocupado" : "Disponible"}
            </Badge>
          </div>
          {showActions && onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(trastero)} className="hover:bg-accent/10">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isOcupado && inquilino ? (
          <>
            <div className="bg-muted/30 p-3 rounded-md">
              <p className="text-sm font-semibold text-muted-foreground">Inquilino</p>
              <p className="text-sm font-bold">
                {inquilino.nombre} {inquilino.apellidos}
              </p>
            </div>

            {inquilino.fechaAlta && (
              <div className="bg-muted/30 p-2 rounded-md">
                <p className="text-xs font-semibold text-muted-foreground">Fecha de alta</p>
                <p className="text-sm font-medium">{new Date(inquilino.fechaAlta).toLocaleDateString("es-ES")}</p>
              </div>
            )}

            <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
              {trastero.alCorrientePago ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-semibold">
                {trastero.alCorrientePago ? "Al corriente" : "Pago pendiente"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm p-2 bg-muted/20 rounded-md">
              <Key className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {trastero.llaves.cantidad} {trastero.llaves.tipo}
              </span>
            </div>

            {trastero.codigoAlarma && (
              <div className="flex items-center gap-2 text-sm p-2 bg-muted/20 rounded-md">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium">Código: {trastero.codigoAlarma}</span>
              </div>
            )}

            <div className="text-sm bg-accent/10 p-3 rounded-md border border-accent/20">
              <p className="text-xs font-semibold text-muted-foreground">Precio mensual</p>
              <p className="font-bold text-lg text-accent">{trastero.precioMensual}€/mes</p>
            </div>

            {showActions && onRemoveInquilino && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-destructive/50 text-destructive hover:bg-destructive/10 font-semibold bg-transparent"
                onClick={() => onRemoveInquilino(trastero)}
              >
                <UserX className="h-4 w-4 mr-2" />
                Liberar trastero
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-6 bg-muted/20 rounded-md">
            <p className="text-sm font-semibold text-muted-foreground">Trastero disponible</p>
            <p className="text-2xl font-bold mt-2 text-accent">{trastero.precioMensual}€/mes</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
