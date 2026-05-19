import './globals.css';

export const metadata = {
  title: 'Report a Bug — Group 8',
  description: 'Public bug report form for the TCSS 460 Group 8 API.',
};

const themeBootstrap = `
(function(){try{
  var s=localStorage.getItem('theme');
  var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches;
  document.documentElement.setAttribute('data-theme', s || (m?'light':'dark'));
}catch(e){}})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
