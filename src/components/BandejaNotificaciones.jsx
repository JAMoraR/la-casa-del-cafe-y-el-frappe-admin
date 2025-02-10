"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { insumos, ventas, nomina } from "../data/localData";

export function BandejaNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNotificaciones = localStorage.getItem("notificaciones");
      setNotificaciones(savedNotificaciones ? JSON.parse(savedNotificaciones) : []);
      setIsClient(true);
    }
  }, []);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const notificacionesRef = useRef(null);

  useEffect(() => {
    const nuevasNotificaciones = [];

    // Verificar insumos bajos
    insumos.forEach((insumo) => {
      if (insumo.cantidad < 20) {
        nuevasNotificaciones.push({
          mensaje: `Alerta: ${insumo.nombre} está bajo en stock (${insumo.cantidad} ${insumo.unidad})`,
          fecha: new Date().toISOString(),
          leida: false,
        });
      }
    });

    // Verificar ventas bajas
    const ventasHoy = ventas.filter(
      (venta) => venta.fecha === new Date().toISOString().split("T")[0]
    );
    const totalVentasHoy = ventasHoy.reduce(
      (total, venta) => total + venta.total,
      0
    );
    if (totalVentasHoy < 1000) {
      nuevasNotificaciones.push({
        mensaje: `Alerta: Las ventas de hoy están bajas ($${totalVentasHoy})`,
        fecha: new Date().toISOString(),
        leida: false,
      });
    }

    // Verificar nómina alta
    const nominaHoy = nomina.filter(
      (registro) => registro.fecha === new Date().toISOString().split("T")[0]
    );
    const totalNominaHoy = nominaHoy.reduce(
      (total, registro) => total + registro.horas * registro.tarifa,
      0
    );
    if (totalNominaHoy > 5000) {
      nuevasNotificaciones.push({
        mensaje: `Alerta: La nómina de hoy es alta ($${totalNominaHoy})`,
        fecha: new Date().toISOString(),
        leida: false,
      });
    }

    setNotificaciones((prev) => [...prev, ...nuevasNotificaciones]);
  }, []);

  useEffect(() => {
    localStorage.setItem("notificaciones", JSON.stringify(notificaciones));
  }, [notificaciones]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificacionesRef.current &&
        !notificacionesRef.current.contains(event.target)
      ) {
        setMostrarNotificaciones(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const marcarComoLeidas = () => {
    setNotificaciones(
      notificaciones.map((notificacion) => ({ ...notificacion, leida: true }))
    );
  };

  const hayNotificacionesNoLeidas = notificaciones.some(
    (notificacion) => !notificacion.leida
  );

  return (
    <div className="relative" ref={notificacionesRef}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {hayNotificacionesNoLeidas && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full" />
        )}
      </Button>
      {mostrarNotificaciones && (
        <Card className="absolute right-0 mt-2 w-64 z-10">
          <CardContent className="py-2">
            {notificaciones.length === 0 ? (
              <p>No hay notificaciones</p>
            ) : (
              <>
                {notificaciones.map((notificacion, index) => (
                  <div key={index} className="text-sm mb-2">
                    <p>{notificacion.mensaje}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notificacion.fecha).toLocaleString()}
                    </p>
                  </div>
                ))}
                <Button onClick={marcarComoLeidas} className="w-full mt-2">
                  Marcar todas como leídas
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
