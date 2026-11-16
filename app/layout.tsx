import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
    title: "ESSENCE — Votre parfum, votre signature",
    description: "Découvrez l’univers ESSENCE : des parfums boisés, floraux et ambrés. Explorez la collection et trouvez la signature qui vous ressemble.",
    icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
    return (<html lang="fr">
      <body>{children}</body>
    </html>);
}
