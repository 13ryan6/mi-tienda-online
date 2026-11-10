'use client';

import { useEffect } from 'react';
import { initSiteBehavior } from '@/lib/site-behavior';

// Único componente de cliente de la página: conecta el comportamiento (animaciones, filtros, carrito,
// galerías, lightbox, carta digital, reseñas) al marcado renderizado en el servidor.
export default function SiteBehavior() {
  useEffect(() => initSiteBehavior(), []);
  return null;
}
