import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollReveal from "../components/layout/ScrollReveal";

export const metadata = {
  title: "The Trip Tails — True stories, told by travellers",
  description:
    "The Trip Tails is a magazine of true travel stories written by the people who were actually there. Read real tales from the road — then publish your own, free.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400&family=Inter:wght@400;500;600;700&family=Caveat:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ScrollReveal />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}