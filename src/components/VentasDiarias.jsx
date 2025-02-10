"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ventas as ventasIniciales } from "../data/localData";

export function VentasDiarias() {
  const [ventas, setVentas] = useState(() => {
    const savedVentas = localStorage.getItem("ventas");
    return savedVentas ? JSON.parse(savedVentas) : ventasIniciales;
  });

  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ventas Registradas</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventas.map((venta, index) => (
            <TableRow key={index}>
              <TableCell>{venta.fecha}</TableCell>
              <TableCell>{venta.producto}</TableCell>
              <TableCell>{venta.cantidad}</TableCell>
              <TableCell>${venta.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
