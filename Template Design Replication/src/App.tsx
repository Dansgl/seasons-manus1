import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { SkincareStandard } from './components/SkincareStandard';
import { Bestsellers } from './components/Bestsellers';
import { Collections } from './components/Collections';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Philosophy />
        <SkincareStandard />
        <Bestsellers />
        <Collections />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
