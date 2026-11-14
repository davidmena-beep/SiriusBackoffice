// SIRIUS · Zonas de las ciudades (DEC-221). Asesoría · 14/11/2026. Se publica como SIRIUS_ZONAS (Administrador, con motivo).
// Cada zona: id estable (las coberturas apuntan al id), nombre, punto [lat, lng], area (null o [[lat, lng], …]) y estado (Activa | Inactiva).
window.SIRIUS_ZONAS = {
 "version": "1",
 "vigencia": "Demostración (puntos aproximados)",
 "reglas": {
  "asignacion": "Área dibujada manda; si cae en varias áreas, la del punto más cercano. Fuera de áreas, el punto más cercano entre las zonas sin área (si todas tienen área, entre todas). Toda la ciudad queda cubierta.",
  "radio": "De referencia: dibuja el círculo; más lejos se asigna igual, marcado «lejos del centro».",
  "porConfirmar": "Solo cuando la dirección no se pudo ubicar."
 },
 "ciudades": {
  "1701": {
   "radio": 15,
   "zonas": [
    {
     "id": "z1701-1",
     "nombre": "Norte",
     "punto": [
      -0.135,
      -78.482
     ],
     "area": null,
     "estado": "Activa"
    },
    {
     "id": "z1701-2",
     "nombre": "Centro",
     "punto": [
      -0.218,
      -78.508
     ],
     "area": null,
     "estado": "Activa"
    },
    {
     "id": "z1701-3",
     "nombre": "Sur",
     "punto": [
      -0.28,
      -78.54
     ],
     "area": null,
     "estado": "Activa"
    },
    {
     "id": "z1701-4",
     "nombre": "Valle de los Chillos",
     "punto": [
      -0.3,
      -78.46
     ],
     "area": null,
     "estado": "Activa"
    },
    {
     "id": "z1701-5",
     "nombre": "Valles Cumbayá y Tumbaco",
     "punto": [
      -0.205,
      -78.415
     ],
     "area": null,
     "estado": "Activa"
    }
   ]
  },
  "0901": {
   "radio": 12,
   "zonas": [
    {
     "id": "z0901-1",
     "nombre": "Norte",
     "punto": [
      -2.15,
      -79.895
     ],
     "area": null,
     "estado": "Activa"
    },
    {
     "id": "z0901-2",
     "nombre": "Centro",
     "punto": [
      -2.193,
      -79.885
     ],
     "area": null,
     "estado": "Activa"
    },
    {
     "id": "z0901-3",
     "nombre": "Sur",
     "punto": [
      -2.245,
      -79.905
     ],
     "area": null,
     "estado": "Activa"
    },
    {
     "id": "z0901-4",
     "nombre": "Vía a la Costa",
     "punto": [
      -2.18,
      -79.99
     ],
     "area": null,
     "estado": "Activa"
    }
   ]
  },
  "0101": {
   "radio": 10,
   "zonas": [
    {
     "id": "z0101-1",
     "nombre": "Norte",
     "punto": [
      -2.878,
      -78.992
     ],
     "area": null,
     "estado": "Activa"
    },
    {
     "id": "z0101-2",
     "nombre": "Centro",
     "punto": [
      -2.897,
      -79.004
     ],
     "area": null,
     "estado": "Activa"
    },
    {
     "id": "z0101-3",
     "nombre": "Sur",
     "punto": [
      -2.92,
      -79.015
     ],
     "area": null,
     "estado": "Activa"
    }
   ]
  }
 }
};
