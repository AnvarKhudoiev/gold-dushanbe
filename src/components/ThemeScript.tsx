/** Применяет сохранённую тему до отрисовки, чтобы страница не мигала. */
export default function ThemeScript() {
  const code = "try{var t=localStorage.getItem('gd_t');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}";
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
