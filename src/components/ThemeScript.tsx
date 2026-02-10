export function ThemeScript() {
  const script = `
    (function() {
      try {
        var theme = JSON.parse(localStorage.getItem('pomodisc:theme'));
        if (theme === 'dark' || theme === null) {
          document.documentElement.classList.add('dark');
        }
      } catch(e) {
        document.documentElement.classList.add('dark');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
