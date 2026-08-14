import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'GraphLens — Technology Knowledge Graph Backed by CognoDB',
  description:
    'Cinematic 3D scroll-driven technology knowledge graph explorer demonstrating multi-hop openCypher traversals on CognoDB Cloud.',
  keywords: [
    'Graph Database',
    'CognoDB',
    'Neo4j',
    'openCypher',
    'Knowledge Graph',
    'Three.js',
    'Next.js',
    'Multi-Hop Traversal',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
