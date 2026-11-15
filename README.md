# RED HOPE v1.0 — MVP interactivo

Preview estático preparado para GitHub Pages.

## Vistas y controles incluidos

- Vista de misión con video MP4 real cuando existe y placeholder explícito cuando la placa sigue pendiente.
- Reproductor de narración separado para los seis nodos MVP.
- Subtítulos activables, mute, play/pause y reinicio.
- Decisiones con rutas `safe`, `risk` y `recovery`.
- Telemetría narrativa: control del rover, integridad del equipo y riesgo de ruta.
- Panel educativo por referencias NASA y analogías terrestres.
- Bitácora de decisiones persistida en `localStorage`.
- Pantalla de final abierto para la autorización a Marte.

## Ejecutar localmente

Desde esta carpeta:

```powershell
python -m http.server 4173
```

Después abrir `http://127.0.0.1:4173/`.

No se usa un backend para el MVP. La carpeta es compatible con hosting estático; las rutas HLS se añadirán cuando los masters MP4 sean aprobados y pasen por MediaConvert.
