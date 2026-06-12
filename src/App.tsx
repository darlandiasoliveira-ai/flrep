/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Brands from './components/Brands';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BrandDetails from './components/BrandDetails';

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <div className="font-sans antialiased text-slate-900 bg-white flex flex-col min-h-screen">
      <ScrollHandler />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<div className="pt-24 min-h-screen pb-12"><About /></div>} />
          <Route path="/produtos" element={<div className="pt-24 min-h-screen pb-12"><Products /></div>} />
          <Route path="/marcas/:slug" element={<BrandDetails />} />
          <Route path="/blog" element={<div className="pt-24 min-h-screen pb-12"><Blog /></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
