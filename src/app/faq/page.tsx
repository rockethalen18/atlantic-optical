import Icons from '@/components/ui/Icons';

const faqCategories = [
  {
    title: 'Productos y Equipos',
    description: 'Todo sobre nuestro catalogo de equipo oftalmico profesional',
    questions: [
      { q: '¿Que tipo de equipos oftalmicos vende Atlantic Optical?', a: 'Ofrecemos equipamiento oftalmico profesional completo: autorefractometros, tonometros, keratometros, lamparas de hendidura, montadoras, optotipos, campimetros, OCT, ecografos oculares, microscopios quirurgicos, y todo tipo de mobiliario clinico para consultorios y clinicas oftalmicas.', icon: Icons.Package },
      { q: '¿Los equipos son nuevos o reacondicionados?', a: 'Todos nuestros equipos son 100% nuevos directos de fabrica. No vendemos equipos reacondicionados ni usados. Cada unidad pasa por control de calidad antes del envio y cuenta con garantia de fabrica de 12 meses.', icon: Icons.ShieldCheck },
      { q: '¿Tienen equipos para clinicas nuevas o solo repuestos?', a: 'Trabajamos con ambos. Si estas equipando una clinica nueva, ofrecemos paquetes completos con todos los equipos necesarios. Si solo necesitas reemplazar o actualizar un equipo especifico, tambien lo manejamos. Consulta por nuestros paquetes de equipamiento completo.', icon: Icons.Phone },
      { q: '¿Que marcas de equipos oftalmicos manejan?', a: 'Somos distribuidores directos de multiples fabricantes chinos especializados en equipo oftalmico. Trabajamos con marcas reconocidas en el mercado asiatico y tambien ofrecemos opciones OEM/ODM para marca propia. Pide nuestro catalogo actualizado para ver todas las opciones disponibles.', icon: Icons.Tag },
      { q: '¿Los equipos tienen certificacion o cumplen estandares internacionales?', a: 'Si, todos nuestros equipos cuentan con certificacion CE (Conformidad Europea) y la mayoria cuenta con registros sanitarios ante las autoridades competentes. Los equipos cumplen con estandares internacionales de calidad ISO 13485. Te proporcionamos toda la documentacion tecnica necesaria para importacion y registro sanitario.', icon: Icons.CheckCircle },
      { q: '¿Puedo ver especificaciones tecnicas antes de comprar?', a: 'Si, en cada ficha de producto encuentras las especificaciones tecnicas completas: medidas, peso, potencia, funciones, accesorios incluidos y manual de usuario en PDF. Si necesitas datasheets adicionales o videos de demostracion, contactanos directamente.', icon: Icons.Phone },
      { q: '¿Que es un autorefractometro y para que sirve?', a: 'El autorefractometro es un equipo que mide automaticamente la graduacion del ojo del paciente (miopia, hipermetropia y astigmatismo) en segundos. Es fundamental en cualquier consultorio oftalmico para agilizar la consulta y obtener mediciones objetivas precisas. Nuestros modelos van desde opciones basicas hasta autorefractometros con keratometro integrado.', icon: Icons.Tag },
      { q: '¿Cual es la diferencia entre tonometro de contacto y sin contacto?', a: 'El tonometro de aplanacion (Goldmann) requiere contacto con la cornea y anestesia, siendo el estandar de oro para medicion de presion intraocular. El tonometro sin contacto (no contact) mide la presion sin tocar el ojo, usando una bocanada de aire, ideal para screenings rapidos y pacientes pediatricos. Ofrecemos ambos tipos.', icon: Icons.Package },
      { q: '¿Que es un OCT y cuando necesito uno?', a: 'OCT (Tomografia de Coherencia Optica) es un equipo de diagnostico por imagen que captura cortes transversales de la retina con alta resolucion. Es esencial para diagnosticar glaucoma, degeneracion macular y edema macular. Si tu clinica maneja pacientes con enfermedades retinianas o glaucoma, un OCT es una inversion fundamental.', icon: Icons.Phone },
      { q: '¿Venden lamparas de hendidura portatiles?', a: 'Si, tenemos lamparas de hendidura portatiles ideales para clinicas con espacio limitado o para medicos que necesitan movilidad. Nuestras opciones portatiles ofrecen la misma calidad de iluminacion y ampliacion que los modelos de mesa, pero en un formato compacto y transportable.', icon: Icons.Package },
    ]
  },
  {
    title: 'Proceso de Compra',
    description: 'Como cotizar, pedir y pagar tu equipo oftalmico',
    questions: [
      { q: '¿Como solicito una cotizacion para equipo oftalmico?', a: 'Puedes solicitar tu cotizacion de varias formas: agregando productos al carrito en nuestra tienda online, enviando un mensaje por WhatsApp al +86 134 0559 5150, o completando el formulario de contacto en nuestra pagina. Para proyectos grandes o clinicas completas, te recomendamos contactarnos directamente para precios especiales.', icon: Icons.Phone },
      { q: '¿Hay minimo de pedido para equipos oftalmicos?', a: 'No hay minimo de pedido. Puedes comprar una sola unidad de cualquier equipo. Sin embargo, para pedidos multiples o voluminosos ofrecemos descuentos por mayoreo que pueden representar un ahorro significativo. Consulta por precios especiales en 3 o mas unidades.', icon: Icons.Package },
      { q: '¿Puedo comprar un solo equipo oftalmico o necesito varios?', a: 'Puedes comprar absolutamente un solo equipo. No exigimos minimo de pedido. Muchos de nuestros clientes compran un equipo especifico para reemplazar uno existente o para agregar una nueva modalidad a su consultorio. El envio se calcula por unidad.', icon: Icons.Package },
      { q: '¿Que metodos de pago aceptan para equipos oftalmicos?', a: 'Aceptamos transferencia bancaria internacional (TT), pagos por PayPal, tarjetas de credito y debito. Para pedidos grandes ofrecemos opciones de financiamiento y planes de pago. El pago se realiza antes del envio excepto para clientes con historial de compra verificado.', icon: Icons.CreditCard },
      { q: '¿Puedo pagar en dolares o en mi moneda local?', a: 'Los precios en nuestra tienda estan mostrados en dolares USD. Aceptamos transferencias en dolares. Para pagos en otras monedas, el tipo de cambio se aplica al momento de la transaccion segun la cotizacion del banco receptoral. Consulta con tu banco sobre comisiones de transferencia internacional.', icon: Icons.CreditCard },
      { q: '¿Ofrecen planes de financiamiento para clinicas?', a: 'Si, para clinicas que necesitan equipar completo o realizar inversiones significativas, ofrecemos planes de financiamiento flexibles. Los terminos varian segun el volumen de la compra. Contactanos directamente para discutir opciones de financiamiento personalizadas para tu proyecto.', icon: Icons.Phone },
      { q: '¿Como se calcula el precio final del equipo oftalmico?', a: 'El precio final incluye: costo del equipo + margen de distribucion + costo de envio (calculado por peso y destino) + tipo de cambio + IVA si aplica. En cada producto puedes ver el desglose completo del precio. No hay costos ocultos. El envio se cotiza aparte segun tu ubicacion.', icon: Icons.Tag },
      { q: '¿Puedo solicitar una cotizacion personalizada para mi clinica?', a: 'Si, especialmente si estas equipando una clinica completa. Contactanos con tu lista de necesidades y te preparamos una cotizacion personalizada con precios especiales, paquetes y condiciones de pago favorables. Trabajamos con clinicas, hospitales y distribuidores en toda Latinoamerica.', icon: Icons.Phone },
      { q: '¿Tienen descuentos para distribuidores o clinicas con volumen?', a: 'Si, tenemos un programa de descuentos por volumen y precios preferenciales para distribuidores autorizados. Los descuentos varian segun el volumen de compra anual y la relacion comercial. Solicita informacion sobre nuestro programa de distribuidores.', icon: Icons.Tag },
      { q: '¿Que incluye el equipo cuando lo compro?', a: 'Cada equipo incluye: unidad principal segun especificaciones, todos los accesorios estandar, manual de usuario en ingles y/o espanol, cable de conexion, certificado de garantia y documentacion tecnica basica. Algunos equipos incluyen maletin de transporte. Todo se detalla en la ficha tecnica de cada producto.', icon: Icons.Package },
    ]
  },
  {
    title: 'Envio e Importacion',
    description: 'Logistica, tiempos de entrega y documentacion para importar',
    questions: [
      { q: '¿Cuanto tarda el envio de equipo oftalmico desde China?', a: 'Los tiempos varian segun el metodo: envio maritimo 20-40 dias (mas economico), envio aereo 5-10 dias (rapido), express courier 3-7 dias (urgente). El tiempo exacto depende del destino final, la aduana de cada pais y la disponibilidad del producto en fabrica. Te informamos el tiempo estimado al confirmar tu pedido.', icon: Icons.Truck },
      { q: '¿Envian equipo oftalmico a todo Latinoamerica?', a: 'Si, realizamos envios a toda Latinoamerica: Mexico, Colombia, Peru, Chile, Argentina, Ecuador, Venezuela, Bolivia, Paraguay, Uruguay, Costa Rica, Panama, Guatemala, Honduras, El Salvador, Nicaragua y Republica Dominicana. Consulta tarifas especificas para tu pais.', icon: Icons.Truck },
      { q: '¿El envio incluye la documentacion para importar?', a: 'Si, con cada envio incluimos: factura comercial, lista de empaque (packing list), certificado de origen, certificado CE y toda la documentacion tecnica necesaria para el despacho aduanal de tu pais. Si necesitas documentos adicionales para registro sanitario, los gestionamos sin costo extra.', icon: Icons.CheckCircle },
      { q: '¿Quien se encarga del despacho aduanal en mi pais?', a: 'El despacho aduanal corre por cuenta del comprador en el pais de destino. Nosotros entregamos la documentacion completa en origen para que tu agente aduanal pueda gestionar la importacion. Si necesitas recomendaciones de agentes aduanales en tu pais, podemos orientarte.', icon: Icons.Phone },
      { q: '¿Como se embalan los equipos oftalmicos para envio?', a: 'Todos nuestros equipos se embalan con estandares internacionales de exportacion: cajas de carton corrugado con doble pared, espuma de polietileno de alta densidad, proteccion en esquinas, y etiquetado fragile cuando aplica. Equipos delicados como OCT o lamparas de hendidura van en cajas de madera contrachapada. El embalaje esta incluido en el precio.', icon: Icons.Package },
      { q: '¿Puedo rastrear mi envio de equipo oftalmico?', a: 'Si, una vez despachado el pedido te proporcionamos el numero de guia de rastreo (tracking number) para que puedas seguir tu envio en tiempo real. Para envios maritimos te damos el numero del contenedor. Para envios aereos y express, el tracking esta disponible en la pagina del transportista.', icon: Icons.Truck },
      { q: '¿Que pasa si el equipo llega danado por el envio?', a: 'Todos nuestros envios incluyen seguro de transporte. Si el equipo llega danado, debes reportarlo en un plazo de 48 horas despues de la entrega con fotos del embalaje y del dano. Gestionamos el reclamo con la aseguradora y te enviamos un reemplazo o reparacion sin costo adicional.', icon: Icons.ShieldCheck },
      { q: '¿Puedo coordinar mi propio agente de carga o transportista?', a: 'Si, puedes coordinar tu propio transportista o agente de carga. En ese caso, coordinamos la entrega del equipo en nuestra bodega o fabrica para que tu transportista lo recoja. Esta opcion puede ahorrarte costos de envio si ya tienes convenios con transportistas internacionales.', icon: Icons.Phone },
      { q: '¿Cuanto cuesta el envio de equipo oftalmico a mi pais?', a: 'El costo del envio depende del peso y volumen del equipo, el metodo de envio (maritimo, aereo o express) y el destino final. Te proporcionamos una cotizacion de envio exacta una vez que confirmas tu pedido y destino. Puedes calcular un estimado en nuestro carrito de compras.', icon: Icons.Tag },
      { q: '¿Necesito licencia o permiso especial para importar equipo oftalmico?', a: 'Depende de la regulacion de cada pais. En la mayoria de paises latinoamericanos, el equipo oftalmico requiere registro sanitario ante la autoridad competente (COFEPRIS en Mexico, INVIMA en Colombia, etc.). Te proporcionamos la documentacion tecnica necesaria para gestionar este registro. Te recomendamos verificar los requisitos en tu pais antes de comprar.', icon: Icons.Phone },
    ]
  },
  {
    title: 'Garantia y Soporte',
    description: 'Proteccion de tu inversion y asistencia tecnica post-venta',
    questions: [
      { q: '¿Que cubre la garantia de los equipos oftalmicos?', a: 'La garantia cubre defectos de fabricacion y componentes defectuosos durante 12 meses desde la fecha de compra. Cubre reparacion o reemplazo gratuito del equipo. La garantia no cubre danos por uso indebido, accidentes, desgaste natural, modificaciones no autorizadas o danos por ambiente no controlado.', icon: Icons.ShieldCheck },
      { q: '¿Como reporto un problema con mi equipo oftalmico bajo garantia?', a: 'Contactanos por WhatsApp, email o telefono con: numero de orden, modelo del equipo, descripcion del problema y fotos o videos del defecto. Nuestro equipo tecnico evalua la situacion y determina la mejor solucion: reparacion remota, envio de repuestos, o reemplazo completo del equipo.', icon: Icons.Phone },
      { q: '¿La garantia cubre el envio de reparacion?', a: 'Si, durante los primeros 12 meses, el envio de repuestos y el reemplazo del equipo son sin costo adicional para el cliente. Nosotros cubrimos los costos de logistica para garantias. Despues del periodo de garantia, ofrecemos servicio de reparacion con costo de repuestos y mano de obra.', icon: Icons.Truck },
      { q: '¿Ofrecen soporte tecnico post-venta?', a: 'Si, ofrecemos soporte tecnico permanente por WhatsApp, email y telefono. Nuestro equipo tecnico puede asistirte con configuracion, calibracion, dudas de uso y diagnostico de problemas. Para problemas complejos, coordinamos videollamadas de soporte tecnico con nuestros ingenieros en fabrica.', icon: Icons.Phone },
      { q: '¿Que pasa despues del periodo de garantia de 12 meses?', a: 'Despues de la garantia, ofrecemos servicio tecnico de por vida con costo de repuestos y mano de obra. Mantenemos disponibilidad de repuestos por al menos 7 anos para cada modelo que vendemos. Tambien ofrecemos contratos de mantenimiento preventivo para clinicas con varios equipos.', icon: Icons.Wrench },
      { q: '¿Puedo adquirir una garantia extendida para mi equipo oftalmico?', a: 'Si, ofrecemos planes de garantia extendida de 24 y 36 meses para todos nuestros equipos. La garantia extendida incluye las mismas coberturas que la garantia estandar: reparacion o reemplazo sin costo. Solicita una cotizacion de garantia extendida al momento de tu compra.', icon: Icons.ShieldCheck },
      { q: '¿Que hago si mi equipo necesita reparacion?', a: 'Primero contacta a nuestro soporte tecnico. Muchos problemas se resuelven con soporte remoto. Si es necesario enviar el equipo, coordinamos la recoleccion en tu ubicacion, lo reparamos o reemplazamos, y te lo devolvemos. Durante la garantia, todo es sin costo. Fuera de garantia, te cotizamos la reparacion antes de proceder.', icon: Icons.Wrench },
      { q: '¿Dan capacitacion para usar los equipos oftalmicos?', a: 'Si, con la compra de equipos complejos como OCT, campimetros o autorefractometros avanzados, incluimos capacitacion basica por videollamada. Para clinicas que equipan multiples unidades, ofrecemos sesiones de capacitacion para todo el personal medico y tecnico. Consulta por nuestros paquetes de capacitacion.', icon: Icons.Phone },
    ]
  },
  {
    title: 'Compatibilidad y Uso',
    description: 'Requisitos tecnicos, voltaje y uso clinico',
    questions: [
      { q: '¿Los equipos funcionan con el voltaje de mi pais?', a: 'Todos nuestros equipos son bivoltaje (110V-240V, 50Hz-60Hz), compatibles con el voltaje estandar de cualquier pais de Latinoamerica. No necesitas transformador ni adaptador. Incluimos el enchufe compatible con tu pais segun la direccion de envio.', icon: Icons.Tag },
      { q: '¿Necesito conexion a internet para usar los equipos?', a: 'La mayoria de equipos basicos (lamparas de hendidura, montadoras, optotipos) no requieren conexion a internet. Equipos avanzados como OCT, campimetros computerizados o autorefractometros con software pueden necesitar internet para actualizaciones de software o envio de datos. Todos funcionan sin internet para uso basico.', icon: Icons.Phone },
      { q: '¿Los equipos son compatibles con sistemas de gestion clinica?', a: 'Si, nuestros equipos con conexion digital (OCT, campimetros, autorefractometros) exportan imagenes y datos en formatos estandar (DICOM, JPEG, PDF) compatibles con la mayoria de sistemas de gestion clinica (HIS/PACS). La integracion depende del software que utilices en tu clinica.', icon: Icons.CheckCircle },
      { q: '¿Que espacio necesito en mi consultorio para instalar los equipos?', a: 'Depende del equipo. Una lampara de hendidura necesita un espacio de 1x1.5m. Un OCT necesita una habitacion de al menos 2x2m. Un autorefractometro se instala en una mesa estandar. Te proporcionamos las dimensiones exactas y recomendaciones de distribucion en la ficha tecnica de cada producto.', icon: Icons.Package },
      { q: '¿Los equipos vienen con manual en espanol?', a: 'La mayoria de equipos incluyen manual en ingles. Para equipos con software digital, el idioma del interface se puede cambiar a espanol o portugues. Si necesitas manuales traducidos al espanol, los gestionamos con el fabricante sin costo adicional para pedidos superiores a 3 unidades.', icon: Icons.Phone },
      { q: '¿Necesito personal tecnico capacitado para usar estos equipos?', a: 'Equipos basicos como lamparas de hendidura y optotipos los puede operar cualquier personal medico. Equipos avanzados como OCT o campimetros requieren capacitacion basica que incluimos con la compra. Recomendamos que al menos un tecnico o medico reciba la capacitacion completa.', icon: Icons.Phone },
      { q: '¿Puedo instalar los equipos yo mismo o necesito un tecnico?', a: 'La mayoria de equipos vienen con instrucciones de instalacion paso a paso. Equipos basicos se instalan facilmente. Equipos complejos como OCT o microscopios pueden requerir instalacion profesional. Ofrecemos soporte de instalacion remota por videollamada y, para clinicas en ciudades principales, podemos coordinar un tecnico presencial.', icon: Icons.Phone },
      { q: '¿Los equipos necesitan calibracion periodic?', a: 'Si, todos los equipos de medicion (autorefractometros, tonometros, keratometros, OCT) requieren calibracion periodica segun las recomendaciones del fabricante. Generalmente es anual. Te proporcionamos el manual de calibracion y, si lo necesitas, coordinamos servicio de calibracion con distribuidores en tu pais.', icon: Icons.Wrench },
    ]
  },
  {
    title: 'Devoluciones y Cambios',
    description: 'Politicas de devolucion, cambio y reembolso',
    questions: [
      { q: '¿Puedo devolver un equipo oftalmico si no me gusta?', a: 'Aceptamos devoluciones dentro de los primeros 30 dias despues de la entrega, siempre que el equipo este en perfectas condiciones, sin uso, con embalaje original y todos los accesorios. Se aplica una tarifa de reabastecimiento del 20% sobre el valor del equipo. El costo de envio de devolucion corre por cuenta del cliente.', icon: Icons.Package },
      { q: '¿Que hago si recibo un equipo diferente al que pedi?', a: 'Si recibiste un equipo incorrecto o con errores de pedido, contactanos inmediatamente. Coordinamos la recoleccion del equipo equivocado y el envio del correcto sin costo adicional para ti. Si prefieres un reembolso, lo procesamos en un plazo de 5-7 dias habiles.', icon: Icons.Phone },
      { q: '¿Puedo cancelar mi pedido de equipo oftalmico?', a: 'Puedes cancelar tu pedido sin penalizacion si aun no ha sido despachado de fabrica. Una vez despachado, la cancelacion esta sujeta a una tarifa de reabastecimiento del 20% y los costos de envio de devolucion. Si el equipo ya esta en transito internacional, la cancelacion puede no ser posible.', icon: Icons.Phone },
      { q: '¿Como solicito un reembolso por equipo oftalmico?', a: 'Para solicitar un reembolso, contactanos con tu numero de orden y motivo de devolucion. Una vez recibido y verificado el equipo en nuestras instalaciones, procesamos el reembolso en 5-7 dias habiles via el mismo metodo de pago original. El reembolso incluye el valor del equipo menos la tarifa de reabastecimiento si aplica.', icon: Icons.CreditCard },
      { q: '¿Puedo cambiar un equipo por otro modelo despues de comprarlo?', a: 'Si, puedes solicitar un cambio por un modelo diferente dentro de los primeros 30 dias. El equipo debe estar en perfectas condiciones. Si el nuevo modelo tiene un precio mayor, pagas la diferencia. Si tiene menor precio, te emitimos un credito para futuras compras. Los costos de envio del cambio corren por cuenta del cliente.', icon: Icons.Phone },
      { q: '¿Que pasa si mi equipo llega con danos visibles del envio?', a: 'Si el equipo llega con danos visibles, debes rechazar la entrega y reportarlo inmediatamente con fotos del embalaje y del dano. Gestionamos el reclamo con la aseguradora y te enviamos un reemplazo sin costo. Si ya aceptaste la entrega, tienes 48 horas para reportar el dano con evidencia fotografica.', icon: Icons.ShieldCheck },
      { q: '¿Aceptan devoluciones de equipos usados o instalados?', a: 'No aceptamos devoluciones de equipos que ya fueron instalados o utilizados clinicamente. La politica de devolucion aplica unicamente a equipos nuevos, sin uso, en embalaje original con todos los accesorios. Para equipos con defectos de fabricacion, la garantia de 12 meses cubre reparacion o reemplazo.', icon: Icons.Package },
    ]
  },
  {
    title: 'Distribuidores y OEM',
    description: 'Programa de distribuidores y fabricacion de marca propia',
    questions: [
      { q: '¿Como me hago distribuidor de Atlantic Optical?', a: 'Para unirte a nuestro programa de distribuidores, contactanos con informacion de tu empresa: razon social, registro sanitario, experiencia en el sector y zona geografica de cobertura. Evaluamos cada solicitud y te ofrecemos precios preferenciales, soporte de marketing y condiciones de pago especiales.', icon: Icons.Phone },
      { q: '¿Que beneficios tiene ser distribuidor autorizado?', a: 'Los distribuidores autorizados reciben: precios mayoristas con descuento, soporte de marketing y material promocional, capacitacion en productos, prioridad en envios y stock, terminos de pago extendidos, y exclusividad territorial en su zona. Los beneficios varian segun el nivel de volumen anual.', icon: Icons.Tag },
      { q: '¿Que es OEM y ODM en equipo oftalmico?', a: 'OEM (Original Equipment Manufacturer) es fabricar nuestros equipos existentes con tu marca y diseno personalizado. ODM (Original Design Manufacturer) es disenar y fabricar un equipo nuevo segun tus especificaciones. Ambos servicios estan disponibles para clientes con volumen minimo de 50-100 unidades segun el producto.', icon: Icons.Phone },
      { q: '¿Cual es el pedido minimo para equipo oftalmico con marca propia?', a: 'El pedido minimo para productos OEM es generalmente de 50-100 unidades segun el tipo de equipo. Para ODM (diseno personalizado), el minimo es mayor y depende de la complejidad del proyecto. Estos minimos permiten cubrir los costos de configuracion de fabrica y personalizacion.', icon: Icons.Package },
      { q: '¿Cuanto tiempo toma producir equipo oftalmico con marca propia?', a: 'Para OEM (marca existente): 30-45 dias despues de confirmacion del pedido y pago. Para ODM (diseno nuevo): 60-90 dias incluyendo desarrollo, prototipo y produccion. Los tiempos pueden variar segun la complejidad y la temporada de produccion en fabrica.', icon: Icons.Truck },
      { q: '¿Puedo solicitar muestras antes de hacer un pedido grande?', a: 'Si, para clientes serios que evaluaron nuestro catalogo y quieren verificar la calidad antes de un pedido grande, ofrecemos muestras con costo reembolsable al confirmar el pedido mayorista. El costo de muestras varia segun el equipo y se deduce del primer pedido.', icon: Icons.Package },
      { q: '¿Que documentacion tecnica proporcionan para registro sanitario?', a: 'Para registro sanitario proporcionamos: ficha tecnica completa, certificado CE,ISO 13485, registros de pruebas de laboratorio, manuales de usuario, documentacion de seguridad electrica, y cualquier otra documentacion que solicite la autoridad sanitaria de tu pais. Este servicio esta incluido para clientes mayoristas.', icon: Icons.CheckCircle },
    ]
  },
  {
    title: 'Precios y Cotizaciones',
    description: 'Informacion sobre costos, descuentos y comparativas',
    questions: [
      { q: '¿Los precios incluyen impuestos de importacion?', a: 'Los precios mostrados en nuestra tienda NO incluyen impuestos de importacion de tu pais. Estos varian segun el pais destino (IVA, aranceles, impuestos aduaneros). Te recomendamos consultar con tu agente aduanal los costos de importacion antes de comprar. Nosotros proporcionamos la factura y documentacion para que puedas calcular estos costos.', icon: Icons.Tag },
      { q: '¿Por que sus precios son mas bajos que otros proveedores?', a: 'Somos distribuidores directos de fabricantes chinos, eliminando intermediarios. Ademas,我们的 operamos con margenes competitivos para ofrecer los mejores precios en equipo oftalmico de calidad. La compra directa de fabrica nos permite ofrecer precios 20-40% mas bajos que distribuidores locales en Latinoamerica.', icon: Icons.Tag },
      { q: '¿Puedo comparar precios con otros proveedores de equipo oftalmico?', a: 'Te recomendamos comparar. Solicita cotizaciones a otros proveedores y comparalas con las nuestras. Verifica que incluyan: garantia, documentacion tecnica, certificaciones y soporte post-venta. Nuestra propuesta de valor incluye todos estos servicios adicionales al mejor precio posible.', icon: Icons.Phone },
      { q: '¿Los precios cambian con frecuencia?', a: 'Nuestros precios se actualizan trimestralmente segun fluctuaciones de tipo de cambio, costos de produccion y materia prima. Los precios en la tienda estan actualizados. Para cotizaciones validas por mas de 30 dias, solicita una cotizacion formal por email con vigencia confirmada.', icon: Icons.Tag },
      { q: '¿Ofrecen descuentos por volumen en equipos oftalmicos?', a: 'Si, ofrecemos descuentos progresivos por volumen: 5-9 unidades: 5% descuento, 10-19 unidades: 8% descuento, 20-49 unidades: 12% descuento, 50+ unidades: descuento especial a negociar. Los descuentos aplican a pedidos de un mismo modelo o mezcla de modelos en un mismo envio.', icon: Icons.Tag },
      { q: '¿Puedo negociar el precio de un equipo oftalmico especifico?', a: 'Para pedidos multiples o proyectos grandes, si podemos negociar precios especiales. Contactanos con tu presupuesto y cantidad requerida. Para compras de un solo equipo, los precios en la tienda son los precios finales con mejor relacion calidad-precio del mercado.', icon: Icons.Phone },
      { q: '¿Que tan competitivos son sus precios vs proveedores locales?', a: 'Nuestros precios son significativamente mas bajos que los distribuidores locales (20-40% de ahorro promedio). La diferencia se debe a que eliminamos intermediarios y trabajamos directo con fabricas chinas. Ademas, el equipo es exactamente el mismo que venden los distribuidores locales, solo que sin el margen adicional del intermediario.', icon: Icons.Tag },
    ]
  },
];

export default function FAQPage() {
  const totalQuestions = faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[var(--green)]/90 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-14 md:py-20 relative z-10 text-center">
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">Centro de Ayuda</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-white tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Preguntas Frecuentes
          </h1>
          <p className="text-[14px] text-white/60 mt-3 max-w-[500px] mx-auto">Respuestas a las preguntas mas comunes sobre compra, envio y soporte de equipo oftalmico profesional.</p>
          <p className="text-[12px] text-white/40 mt-2">{totalQuestions} preguntas organizadas por categoria</p>
        </div>
      </div>

      {/* Categories navigation */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
            {faqCategories.map((cat, i) => (
              <a
                key={i}
                href={`#faq-${i}`}
                className="px-4 py-2 bg-white border border-[var(--border)] hover:border-[var(--green)]/30 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.1em] whitespace-nowrap transition-colors hover:text-[var(--green)]"
              >
                {cat.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="space-y-16">
          {faqCategories.map((cat, catIndex) => (
            <section key={catIndex} id={`faq-${catIndex}`}>
              <div className="mb-8">
                <h2 className="text-[24px] font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {cat.title}
                </h2>
                <p className="text-[13px] text-[var(--text-muted)] mt-1">{cat.description}</p>
              </div>

              <div className="space-y-2">
                {cat.questions.map((f, qIndex) => (
                  <details key={qIndex} className="group bg-white border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors overflow-hidden">
                    <summary className="flex items-center gap-4 cursor-pointer p-5 md:p-6">
                      <div className="w-10 h-10 bg-[var(--green)]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--green)]/15 transition-colors">
                        <f.icon size={18} className="text-[var(--green)]" />
                      </div>
                      <span className="flex-1 text-[14px] font-bold text-[var(--text)]">{f.q}</span>
                      <Icons.ChevronDown size={16} className="text-[var(--text-muted)] group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                      <div className="pl-14">
                        <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">{f.a}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* SEO structured data - FAQPage schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqCategories.flatMap(cat =>
                cat.questions.map(f => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: f.a,
                  },
                }))
              ),
            }),
          }}
        />

        {/* Contact CTA */}
        <div className="mt-16 p-8 bg-[var(--green)] text-center">
          <h3 className="text-[18px] font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            ¿No encontraste tu respuesta?
          </h3>
          <p className="text-[13px] text-white/60 mb-5">
            Nuestro equipo esta listo para resolver tus dudas sobre equipo oftalmico profesional.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/contacto" className="inline-flex items-center gap-2 bg-white text-[var(--green)] font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-white/90 transition-colors">
              Formulario de Contacto <Icons.ArrowRight size={12} />
            </a>
            <a href="https://wa.me/8613405595150" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-white/20 transition-colors">
              WhatsApp <Icons.ArrowRight size={12} />
            </a>
          </div>
        </div>

        {/* Related pages for internal linking */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/garantia" className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors">
            <Icons.ShieldCheck size={20} className="text-[var(--green)] mb-3" />
            <h4 className="text-[13px] font-bold text-[var(--text)] mb-1">Garantia y Devoluciones</h4>
            <p className="text-[12px] text-[var(--text-muted)]">Conoce nuestra politica de garantia de 12 meses y proceso de devoluciones.</p>
          </a>
          <a href="/distribuidores" className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors">
            <Icons.Phone size={20} className="text-[var(--green)] mb-3" />
            <h4 className="text-[13px] font-bold text-[var(--text)] mb-1">Programa Distribuidores</h4>
            <p className="text-[12px] text-[var(--text-muted)]">Unete a nuestra red de distribuidores autorizados en toda Latinoamerica.</p>
          </a>
          <a href="/oem-odm" className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors">
            <Icons.Package size={20} className="text-[var(--green)] mb-3" />
            <h4 className="text-[13px] font-bold text-[var(--text)] mb-1">OEM / ODM</h4>
            <p className="text-[12px] text-[var(--text-muted)]">Fabrica equipo oftalmico con tu marca propia o diseno personalizado.</p>
          </a>
        </div>
      </div>
    </div>
  );
}