# Clinic Platform Prototype

Prototipo navegable de una plataforma clínica, construido con React, Vite y Mantine. El expediente de pacientes toma como referencia visual la captura proporcionada, el [Storybook de Medplum](https://storybook.medplum.com/?path=/docs/medplum-introduction--docs) y la organización del [demo oficial de agenda](https://github.com/medplum/medplum-scheduling-demo).

La vista de pacientes incluye ficha longitudinal, pestañas clínicas, lista y detalle de tareas, filtros, notas y acciones de demostración. Los datos y cambios viven sólo en el navegador durante la sesión: no hay conexión con Medplum ni almacenamiento clínico real.

## Ejecutar

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

El resultado estático queda en `dist/` y puede publicarse directamente en Cloudflare Pages.
