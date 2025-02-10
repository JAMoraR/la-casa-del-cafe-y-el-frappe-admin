"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export function Reportes() {
  const [periodoReporte, setPeriodoReporte] = useState("semanal");

  const datosVentas = {
    semanal: {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datos: [1200, 1900, 1500, 2000, 2400, 2800, 2200],
    },
    mensual: {
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      datos: [8000, 9500, 10200, 11000],
    },
    trimestral: {
      labels: ["Enero", "Febrero", "Marzo"],
      datos: [30000, 32000, 35000],
    },
  };

  const datosGastos = {
    semanal: {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datos: [800, 1000, 900, 1100, 1300, 1500, 1200],
    },
    mensual: {
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      datos: [5000, 5500, 6000, 6200],
    },
    trimestral: {
      labels: ["Enero", "Febrero", "Marzo"],
      datos: [20000, 21000, 22000],
    },
  };

  const ventasData = {
    labels: datosVentas[periodoReporte].labels,
    datasets: [
      {
        label: "Ventas",
        data: datosVentas[periodoReporte].datos,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const rentabilidadData = {
    labels: datosVentas[periodoReporte].labels,
    datasets: [
      {
        label: "Ventas",
        data: datosVentas[periodoReporte].datos,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Gastos",
        data: datosGastos[periodoReporte].datos,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Reportes</h2>
      <Select value={periodoReporte} onValueChange={setPeriodoReporte}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccione el periodo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semanal">Semanal</SelectItem>
          <SelectItem value="mensual">Mensual</SelectItem>
          <SelectItem value="trimestral">Trimestral</SelectItem>
        </SelectContent>
      </Select>
      <Card>
        <CardHeader>
          <CardTitle>Ventas por Periodo</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={ventasData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rentabilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={rentabilidadData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resumen Financiero</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Ingresos Totales: $
            {datosVentas[periodoReporte].datos.reduce((a, b) => a + b, 0)}
          </p>
          <p>
            Gastos Totales: $
            {datosGastos[periodoReporte].datos.reduce((a, b) => a + b, 0)}
          </p>
          <p>
            Rentabilidad: $
            {datosVentas[periodoReporte].datos.reduce((a, b) => a + b, 0) -
              datosGastos[periodoReporte].datos.reduce((a, b) => a + b, 0)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
