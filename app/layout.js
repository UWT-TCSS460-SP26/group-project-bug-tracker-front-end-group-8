import './globals.css';

export const metadata = {
  title: 'Report a Bug — Group 8',
  description: 'Public bug report form for the TCSS 460 Group 8 API.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
