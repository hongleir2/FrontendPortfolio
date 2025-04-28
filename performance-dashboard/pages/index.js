import Head from "next/head";
import PerformanceAnalysis from "../components/PerformanceAnalysis";

export default function Home() {
  return (
    <div className="container mx-auto">
      <Head>
        <title>Performance Monitoring Dashboard</title>
        <meta name="description" content="Electron app performance analysis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-10">
        <PerformanceAnalysis />
      </main>
    </div>
  );
}
