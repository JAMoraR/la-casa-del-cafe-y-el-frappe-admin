"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function ReporteSemanal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Aquí iría la lógica para obtener los datos del backend
    // Por ahora, usaremos datos de ejemplo
    const datosEjemplo = {
      ingresos: [1000, 1200, 900, 1500, 1300, 1100, 1400],
      gastos: [800, 750, 900, 1000, 850, 800, 950],
      productos: {
        "Café Americano": 120,
        Cappuccino: 80,
        Latte: 100,
        Espresso: 60,
        "Frappé de Vainilla": 90,
      },
    };
    setData(datosEjemplo);
  }, []);

  if (!data) return <div>Cargando...</div>;

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const rentabilidadData = {
    labels: diasSemana,
    datasets: [
      {
        label: "Ingresos",
        data: data.ingresos,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Gastos",
        data: data.gastos,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const productosData = {
    labels: Object.keys(data.productos),
    datasets: [
      {
        label: "Ventas por Producto",
        data: Object.values(data.productos),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Reporte Semanal</h2>
      <Card>
        <CardHeader>
          <CardTitle>Rentabilidad Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={rentabilidadData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ventas por Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={productosData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resumen Financiero</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Ingresos Totales: ${data.ingresos.reduce((a, b) => a + b, 0)}</p>
          <p>Gastos Totales: ${data.gastos.reduce((a, b) => a + b, 0)}</p>
          <p>
            Rentabilidad: $
            {data.ingresos.reduce((a, b) => a + b, 0) -
              data.gastos.reduce((a, b) => a + b, 0)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
