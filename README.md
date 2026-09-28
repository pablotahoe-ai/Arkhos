# Grupo Arkhos — primera estructura

Sitio de una página, sin build ni dependencias de JavaScript. Abrir `index.html` para revisar la primera dirección visual.

## Secciones

1. Header con anclas a Desarrollos, Quiénes somos y Contacto. Espacio previsto para enlazar Romina Ducid.
2. Portada (`hero.css` + bloque final de `script.js`): cortina de tela que se levanta desde el centro al tirar del cordón (clic o arrastre hacia arriba), formando pliegues en V; debajo, imagen desenfocada con un recuadro blanco nítido sobre el edificio (`BUILDING` en script.js define su ubicación en `assets/hero-mdp.webp`). Con el scroll el recuadro se abre a pantalla completa y queda “Ulises I · Mar del Plata”.
3. 01 / Desarrollos en curso (`.dev`): rueda de gajos que gira con el scroll (sección fija); el activo queda al frente y su nombre aparece en el disco central. Proyectos en el arreglo `projects` de `script.js`; estilos en `sections.css`.
4. 02 / Obras entregadas (`#entregadas`, estilos en `sections.css`): texto a la izquierda y franjas a la derecha. Solo se abren arrastrando el círculo; desde la mitad del recorrido la franja crece. La galería se cierra arrastrando “Deslizá para volver” (o flecha izquierda / Escape). Lista en `delivered`.
5. 03 / Quiénes somos: valores que se activan con el scroll y descripción fija a la izquierda (`values` en `script.js`, estilos `.vg` en `sections.css`).
6. 04 / Contacto, a la espera del destino final, y footer.

## Fuente de materiales

- `Grupo Arkhos.pdf`: estructura, lema y texto institucional propuestos por el CM.
- Drive compartido: manual de marca (logo, Tenor Sans, Montserrat, `#CD9818`, `#E6E0D2`, `#2E3740`, blanco) y renders de Ulises I–IV.
- Web actual: contexto y fotos de Lipari Libertad, Lipari La Rioja y Lipari Perla. No se copiaron sus estados comerciales por estar potencialmente desactualizados.

## Pendiente antes de publicar

- URL de Romina Ducid y destino de “Armanolit” o contacto final.
- Confirmar si el nombre del proyecto entregado es **Quiroga** (mensaje de Matías) o **Kiron** (web actual).
- Confirmar los estados, textos y fotos definitivos de cada desarrollo. La disponibilidad y los precios no se muestran.
- Agregar material visual de Quiroga y confirmar si corresponde a la obra citada en el mensaje de Matías; la web actual muestra “Kiron”.
- Completar, si se desea, la información de cada galería: ubicación, características y CTA.
- Revisar textos institucionales con el cliente; las frases cortas de los valores son redacción provisional.
- Confirmar el texto de ubicación de Ulises I y la distancia exacta a la costa antes de afirmar una cantidad de cuadras.

Los archivos `assets/*.webp` son copias optimizadas de renders del Drive. Las fotos de `assets/delivered/` se optimizaron desde la web actual de Grupo Arkhos. Los PNG de logo se derivaron del manual de marca.
