import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="panel" style={{ paddingBlock: 48 }}>
      <Logo />
      <h2>Такого товара нет / Чунин маҳсулот нест</h2>
      <p className="hint">Возможно, его убрали из каталога. / Эҳтимол, онро аз каталог гирифтаанд.</p>
      <Link href="/" className="btn" style={{ justifySelf: "start" }}>В каталог / Ба каталог</Link>
    </main>
  );
}
