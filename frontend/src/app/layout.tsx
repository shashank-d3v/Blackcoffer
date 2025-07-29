import './globals.css';

export const metadata = {
  title: 'Blackcoffer Dashboard',
  description: 'Data visualization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
