'use client';

import ScrollExpandMedia from '@/components/ui/ScrollExpandMedia';

export default function ScrollExpandSection() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/images/hero/magnifying-glass.mp4"
      posterSrc="/images/hero/eye-exam-machine.jpg"
      bgImageSrc="/images/hero/eye-exam-machine.jpg"
      title="Equipo Profesional de Última Generación"
      date="Innovación en Óptica"
      scrollToExpand="Desplaza para explorar"
      textBlend={false}
    />
  );
}
