import "@/styles/globals.css";

export const metadata = {
  title: "Administración | La casa del Café y el Frappe",
  description: "Administración de la casa del Café y el Frappe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
