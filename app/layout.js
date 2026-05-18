export const metadata = {
  title: 'File a Bug Report',
  description: 'Submit a bug report to our API',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9f9f9' }}>
        {children}
      </body>
    </html>
  );
}
