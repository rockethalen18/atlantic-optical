'use client';

import ScrollExpandMedia from '@/components/ui/ScrollExpandMedia';

export default function ScrollExpandSection() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/images/hero-3.jpg"
      bgImageSrc="/images/hero-3.jpg"
      title="Equipo Profesional de Última Generación"
      date="Innovación en Óptica"
      scrollToExpand="Desplaza para explorar"
      textBlend={false}
    />
  );
}
