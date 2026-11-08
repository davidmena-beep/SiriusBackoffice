# Exportación · Scoring V3 – Ramos de ubicación (v1)

Solo lectura. Generada desde `datos-ejemplo.js` (`modelosCalificacion`, id `sv3`) y `motor-calificacion.js`. Estado: Vigente · vigente desde 18/10/26 · plantilla: Ubicación – Ramos Generales.

## 1. Escala

- Rango: 0 a 100 · decimales: 1 · Mayor es mejor · agregación: Suma

## 2. Módulos y pesos

| Módulo | Nombre | Peso (%) | Puntos máximos | Agregación | Provisional |
|---|---|---|---|---|---|
| A | Construcción | 30 | 30 | Suma | No |
| B | Gestión y entorno | 35 | 35 | Suma | No |
| C1 | Protección incendio | 20 | 20 | Suma | No |
| C2 | Protección robo | 15 | 15 | Suma | No |
| C3 | Protección de equipo electrónico | 15 | 15 | Suma | Sí |

## 3. Composición y normalización por ramo

| Ramo | Módulos que suman |
|---|---|
| Incendio y líneas aliadas | A, B, C1 |
| Robo | A, B, C2 |
| Equipo electrónico | A, B, C3 |
| Incendio y Robo | A, B, C1, C2 |

Cálculo (tal como lo ejecuta `motor-calificacion.js`, `calc`):

1. Puntos máximos del módulo = peso / 100 × (máx − mín de la escala).
2. Puntos máximos del criterio = % del criterio / 100 × puntos máximos del módulo. Un criterio «No aplica» no suma puntos ni máximo.
3. Puntos del criterio = puntaje obtenido / referencia × puntos máximos del criterio.
4. Puntaje del módulo = puntos obtenidos / máximo de los criterios que aplican × puntos máximos del módulo (se renormaliza si algún criterio es «No aplica»).
5. Total del ramo = mín + (suma de módulos del ramo / suma de sus máximos) × (máx − mín). Sin módulos con máximo, el total es el mínimo de la escala.
6. Banda: la de mayor «desde» que no supere el total. Módulo crítico: porcentaje del módulo menor a 40.

## 4. Criterios

### A · Construcción (30 %)

| Criterio | Campos que lee | Forma | Peso en el módulo (%) | Puntos máximos | Referencia | Combina instancias | Admite «No aplica» |
|---|---|---|---|---|---|---|---|
| A.1 Paredes | `rg_con_paredes` | Tabla de opciones | 26.67 | 8 | 8 | Ponderado por área (rg_con_area) | No |
| A.2 Techos | `rg_con_techo` | Tabla de opciones | 23.33 | 7 | 7 | Ponderado por área (rg_con_area) | No |
| A.3 Estado | `rg_con_conservacion` | Tabla de opciones | 26.67 | 8 | 8 | Ponderado por área (rg_con_area) | No |
| A.4 Pisos y altura | `rg_con_pisos`, `rg_con_subsuelos` | Condición | 13.33 | 4 | 4 | Peor caso | No |
| A.5 Medios de egreso | `rg_con_medios_egreso` | Tabla de opciones | 10 | 3 | 3 | Peor caso | No |

**Tabla de puntaje · A.1 Paredes** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Hormigón o bloque | 8 |  | No | No |
| Metálica con gypsum | 5 |  | No | No |
| Mixta | 2 |  | No | No |
| Madera o combustible | 0 |  | No | No |

**Tabla de puntaje · A.2 Techos** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Losa de hormigón | 7 |  | No | No |
| Metálico o teja | 5 |  | No | No |
| Traslúcido más de 30 % | 3 |  | No | No |
| Paja o madera | 0 |  | No | No |

**Tabla de puntaje · A.3 Estado** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Excelente o nuevo | 8 |  | No | No |
| Bueno | 5 | n2 | No | No |
| Regular | 2 |  | No | No |
| Malo | 0 |  | No | No |

**Tabla de puntaje · A.4 Pisos y altura** (Condición)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| rg_con_pisos = 1–3 y rg_con_subsuelos = Sin subsuelos | 4 |  | No | No |
| rg_con_pisos = 4–6 y rg_con_subsuelos = Sin subsuelos | 2 |  | No | No |
| rg_con_pisos = Más de 6, o rg_con_subsuelos con subsuelo | 0 |  | No | No |

**Regla de la condición · A.4 Pisos y altura** (código de `motor-calificacion.js`)

```js
'A.4': () => { const p = A('rg_con_pisos'), s = A('rg_con_subsuelos'); return comb(p.map((x, i) => (s[i] || 'Sin subsuelos') !== 'Sin subsuelos' || x === 'Más de 6' ? 0 : x === '4–6' ? 2 : 4), p.map((x, i) => x + ' pisos · ' + (s[i] || 'Sin subsuelos').toLowerCase())); },
```

**Tabla de puntaje · A.5 Medios de egreso** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Existen y libres | 3 |  | No | No |
| No existen u obstruidos | 0 |  | No | No |

### B · Gestión y entorno (35 %)

| Criterio | Campos que lee | Forma | Peso en el módulo (%) | Puntos máximos | Referencia | Combina instancias | Admite «No aplica» |
|---|---|---|---|---|---|---|---|
| B.1 Mantenimiento eléctrico | `rg_ele_mantenimiento` | Tabla de opciones | 28.57 | 10 | 10 |  | No |
| B.2 Orden y aseo | `rg_ges_orden_aseo` | Tabla de opciones | 22.86 | 8 | 8 |  | No |
| B.3 Actividad | `rg_ocu_riesgo_ciiu` | Tabla de opciones | 28.57 | 10 | 10 |  | No |
| B.4 Linderos | `rg_lin_tipo_riesgo` | Tabla de opciones | 20 | 7 | 7 | Peor caso entre los 4 linderos | No |

**Tabla de puntaje · B.1 Mantenimiento eléctrico** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Predictivo o termografía | 10 |  | No | No |
| Preventivo con bitácora | 7 |  | No | No |
| Correctivo | 3 |  | No | No |
| Ninguno | 0 |  | No | No |

**Tabla de puntaje · B.2 Orden y aseo** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Excelente | 8 |  | No | No |
| Regular o parcial | 4 |  | No | No |
| Malo | 0 |  | No | No |

**Tabla de puntaje · B.3 Actividad** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Bajo | 10 |  | No | No |
| Medio | 6 |  | No | No |
| Alto | 0 |  | No | No |

**Tabla de puntaje · B.4 Linderos** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Vía pública | 7 |  | No | No |
| Vivienda o riesgo ligero | 7 |  | No | No |
| Comercio | 3 |  | No | No |
| Industria | 0 |  | No | No |
| Baldío | 0 |  | No | No |
| Río o quebrada | 0 |  | No | No |
| Otro | — |  | No | Sí |

### C1 · Protección incendio (20 %)

| Criterio | Campos que lee | Forma | Peso en el módulo (%) | Puntos máximos | Referencia | Combina instancias | Admite «No aplica» |
|---|---|---|---|---|---|---|---|
| C.1 Detección | `rg_pci_det_existe`, `rg_pci_det_central` | Condición | 30 | 6 | 6 |  | No |
| C.2 Extintores | `rg_pci_ext_existe`, `rg_pci_extintores`, `rg_pci_ext_requeridos`, `rg_pci_ext_mantenimiento` | Condición | 25 | 5 | 5 |  | No |
| C.3 Red hídrica | `rg_pci_red_tipo` | Mejor opción (selección múltiple) | 40 | 8 | 8 |  | No |
| C.4 Brigadas | `rg_ges_brigadas` | Sí/No | 5 | 1 | 1 |  | No |

**Tabla de puntaje · C.1 Detección** (Condición)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| rg_pci_det_central = Centralizada, zonificada y supervisada | 6 |  | No | No |
| rg_pci_det_central = Local o manual | 3 |  | No | No |
| rg_pci_det_existe = No, o rg_pci_det_central = No tiene | 0 |  | No | No |

**Regla de la condición · C.1 Detección** (código de `motor-calificacion.js`)

```js
'C.1': () => { const e = one('rg_pci_det_existe'), ce = one('rg_pci_det_central'); return { raw: e === 'No' ? 0 : ce === 'Centralizada, zonificada y supervisada' ? 6 : ce === 'Local o manual' ? 3 : 0, valor: 'Existe: ' + (e || '—') + ' · central: ' + (ce || '—') }; },
```

**Tabla de puntaje · C.2 Extintores** (Condición)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| rg_pci_ext_existe = No | 0 |  | No | No |
| Existen, suma de la columna «Cantidad» de rg_pci_extintores ≥ rg_pci_ext_requeridos y rg_pci_ext_mantenimiento = Vigente con etiqueta | 5 |  | No | No |
| En otro caso | 2 |  | No | No |

**Regla de la condición · C.2 Extintores** (código de `motor-calificacion.js`)

```js
'C.2': () => { const e = one('rg_pci_ext_existe'), q = A('rg_pci_extintores').reduce((a, r) => a + (+r.Cantidad || 0), 0), rq = +one('rg_pci_ext_requeridos') || 0, mt = one('rg_pci_ext_mantenimiento'); const ok = e !== 'No' && q >= rq && mt === 'Vigente con etiqueta'; return { raw: e === 'No' ? 0 : ok ? 5 : 2, valor: e === 'No' ? 'No tiene extintores' : q + ' instalados de ' + rq + ' requeridos · mantenimiento ' + (mt || '—') }; },
```

**Tabla de puntaje · C.3 Red hídrica** (Mejor opción (selección múltiple))

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Rociadores | 8 |  | No | No |
| Gabinetes con bomba | 6 |  | No | No |
| Gabinetes sin bomba | 3 |  | Sí | No |
| Hidrantes | 3 |  | Sí | No |
| Sin red (rg_pci_red_existe = No) | 0 |  | No | No |

**Tabla de puntaje · C.4 Brigadas** (Sí/No)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Sí | 1 |  | No | No |
| No | 0 |  | No | No |

### C2 · Protección robo (15 %)

| Criterio | Campos que lee | Forma | Peso en el módulo (%) | Puntos máximos | Referencia | Combina instancias | Admite «No aplica» |
|---|---|---|---|---|---|---|---|
| C.5 Seguridad física | `rg_rob_cerramiento`, `rg_rob_proteccion_adicional` | Condición | 33.33 | 5 | 5 |  | No |
| C.6 Vigilancia y CCTV | `rg_rob_vig_existe`, `rg_rob_vig_turnos`, `rg_rob_vig_dias`, `rg_rob_alarma_existe`, `rg_rob_cctv_existe` | Condición | 66.67 | 10 | 10 |  | No |

**Tabla de puntaje · C.5 Seguridad física** (Condición)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| rg_rob_cerramiento = Muro de hormigón o bloque, o cualquier cerramiento con Cerco eléctrico o Concertina | 5 |  | No | No |
| Reja metálica, Malla o Mixto sin protección adicional | 3 |  | No | No |
| rg_rob_cerramiento = Abierto | 0 |  | No | No |

**Regla de la condición · C.5 Seguridad física** (código de `motor-calificacion.js`)

```js
'C.5': () => { const ce = one('rg_rob_cerramiento'), pa = A('rg_rob_proteccion_adicional'), extra = pa.includes('Cerco eléctrico') || pa.includes('Concertina'); return { raw: ce === 'Abierto' ? 0 : ce === 'Muro de hormigón o bloque' || extra ? 5 : 3, valor: (ce || '—') + ' · ' + (pa.filter(x => x !== 'Ninguna').join(', ') || 'sin protección adicional') }; },
```

**Tabla de puntaje · C.6 Vigilancia y CCTV** (Condición)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Guardia 24 h (rg_rob_vig_turnos = 24 h o 2x12 y rg_rob_vig_dias = 7 días) + alarma + CCTV | 10 |  | No | No |
| Guardia o alarma, con o sin CCTV | 7 |  | No | No |
| Solo CCTV | 3 |  | No | No |
| Nada | 0 |  | No | No |

**Regla de la condición · C.6 Vigilancia y CCTV** (código de `motor-calificacion.js`)

```js
'C.6': () => { const g = one('rg_rob_vig_existe') === 'Sí', g24 = g && ['24 h', '2x12'].includes(one('rg_rob_vig_turnos')) && one('rg_rob_vig_dias') === '7 días', al = one('rg_rob_alarma_existe') === 'Sí', cc = one('rg_rob_cctv_existe') === 'Sí'; return { raw: g24 && al && cc ? 10 : g || al ? 7 : cc ? 3 : 0, valor: 'Guardia: ' + (g ? one('rg_rob_vig_turnos') + ', ' + one('rg_rob_vig_dias') : 'No') + ' · alarma: ' + (al ? 'Sí' : 'No') + ' · CCTV: ' + (cc ? 'Sí' : 'No') }; },
```

### C3 · Protección de equipo electrónico (15 %)

| Criterio | Campos que lee | Forma | Peso en el módulo (%) | Puntos máximos | Referencia | Combina instancias | Admite «No aplica» |
|---|---|---|---|---|---|---|---|
| C.7 Puesta a tierra | `rg_ee_tierra` | Tabla de opciones | 26.67 | 4 | 4 |  | No |
| C.8 Respaldo de energía | `rg_ee_ups`, `rg_ee_supresor` | Condición | 20 | 3 | 3 |  | No |
| C.9 Ambiente del cuarto técnico | `rg_ee_climatizacion`, `rg_ee_cuarto_humedad` | Condición | 20 | 3 | 3 |  | Sí · cuando rg_ee_cuarto_existe = No |
| C.10 Extinción apta | `rg_ee_extintor_tipo` | Tabla de opciones | 20 | 3 | 3 |  | No |
| C.11 Mantenimiento de equipos | `rg_ee_plan_mantenimiento` | Tabla de opciones | 13.33 | 2 | 2 |  | No |

**Tabla de puntaje · C.7 Puesta a tierra** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Medida 5 ohmios o menos con certificado | 4 |  | No | No |
| Visible sin medición | 2 |  | No | No |
| No tiene | 0 |  | No | No |

**Tabla de puntaje · C.8 Respaldo de energía** (Condición)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| rg_ee_ups = Sí y rg_ee_supresor = Sí | 3 |  | No | No |
| Solo uno de los dos | 2 |  | No | No |
| Ninguno | 0 |  | No | No |

**Regla de la condición · C.8 Respaldo de energía** (código de `motor-calificacion.js`)

```js
'C.8': () => { const n = (one('rg_ee_ups') === 'Sí' ? 1 : 0) + (one('rg_ee_supresor') === 'Sí' ? 1 : 0); return { raw: n === 2 ? 3 : n === 1 ? 2 : 0, valor: 'UPS: ' + (one('rg_ee_ups') || '—') + ' · supresor: ' + (one('rg_ee_supresor') || '—') }; },
```

**Tabla de puntaje · C.9 Ambiente del cuarto técnico** (Condición)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Climatización dedicada y Sin humedad ni desagües encima | 3 |  | No | No |
| Solo uno de los dos | 1 |  | No | No |
| Ninguno | 0 |  | No | No |

**Regla de la condición · C.9 Ambiente del cuarto técnico** (código de `motor-calificacion.js`)

```js
'C.9': () => { const n = (one('rg_ee_climatizacion') === 'Climatización dedicada' ? 1 : 0) + (one('rg_ee_cuarto_humedad') === 'Sin humedad ni desagües encima' ? 1 : 0); return { raw: n === 2 ? 3 : n === 1 ? 1 : 0, valor: (one('rg_ee_climatizacion') || '—') + ' · ' + (one('rg_ee_cuarto_humedad') || '—') }; } };
```

**Tabla de puntaje · C.10 Extinción apta** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| CO2 o agente limpio | 3 |  | No | No |
| Solo PQS | 1 |  | No | No |
| No tiene | 0 |  | No | No |

**Tabla de puntaje · C.11 Mantenimiento de equipos** (Tabla de opciones)

| Cuando | Puntaje | Nivel | Provisional | Puntaje manual |
|---|---|---|---|---|
| Contrato vigente | 2 |  | No | No |
| Interno con registro | 1 |  | No | No |
| Sin plan | 0 |  | No | No |

## 5. Bandas

| Banda | Desde | Hasta | Resultado | Seguimientos |
|---|---|---|---|---|
| Preferente (`pref`) | 85 | 100 | Asegurable | Ninguno |
| Estándar (`est`) | 70 | 84.9 | Asegurable | Recomendaciones de mejora |
| Subestándar (`sub`) | 50 | 69.9 | Asegurable con garantías | Garantías obligatorias · plazo 60 días |
| Crítico (`cri`) | 0 | 49.9 | No asegurable | Envío a nivel 2 si se solicita excepción |

## 6. Niveles de cumplimiento (por criterio)

| Nivel | Desde | Hasta | Uso |
|---|---|---|---|
| Cumplimiento óptimo | 90 | 100 | Atenuante |
| Cumplimiento estándar | 70 | 89 |  |
| Deficiencia menor | 50 | 69 |  |
| Factor de riesgo agravado | 25 | 49 | Agravante |
| Incumplimiento crítico | 0 | 24 | Agravante |

## 7. Reglas de severidad

| Regla | Tipo | Activa | Une condiciones con | Condiciones | Ramos | Giros | Efectos | Mensaje |
|---|---|---|---|---|---|---|---|---|
| Módulo crítico (`s1`) | Regla | Sí | O | módulo cualquiera < 40 % | Todos | Todos | Garantía por módulo crítico: A → sin ítem; B → sin ítem; C1 → GAR-INC-03 «Sistema de detección y alarma contra incendio»; C2 → GAR-ROB-05 «Alarma contra robo»; C3 → DOC-01 «Bitácoras y cronograma de mantenimientos» · Tope de banda: Subestándar · Alerta al calificador | Un módulo quedó bajo el 40 % de su máximo. Se exige su garantía y el resultado no puede pasar de Subestándar. |
| Sin detección en ocupaciones con público (`s2`) | Regla | Sí | O | criterio C.1 = 0 pts | Incendio y líneas aliadas, Incendio y Robo | Comercial, Educación, HORECA, Servicios, Industrial | Exige: GAR-INC-03 «Sistema de detección y alarma contra incendio» · Alerta al calificador | No tiene detección y la ocupación recibe público. Exige el sistema de detección y alarma. |
| Sin permiso de bomberos (`s3`) | Regla | Sí | O | `rg_bom_permiso` está en [No presentado, Vencido] | Todos | Comercial, Industrial, Servicios, HORECA, Educación, Estación de servicios | Exige: GAR-INC-01 «Permiso de bomberos vigente del año en curso» · Alerta al calificador | El permiso de bomberos no está vigente o no se presentó. En este giro es requerido. |
| Sin extintores (`s4`) | Regla | Sí | O | criterio C.2 = 0 pts | Incendio y líneas aliadas, Incendio y Robo | Todos | Exige: GAR-INC-02 «Extintores vigentes y recargados» · Tope de banda: Subestándar · Alerta al calificador | No hay extintores. Se exigen extintores vigentes y el resultado no puede pasar de Subestándar. |
| Riesgo crítico (`s5`) | Regla | Sí | O | banda igual a Crítico; n.º de módulos críticos >= 2 | Todos | Todos | Requiere evaluación de suscripción (nivel 2) · Alerta al calificador | Banda Crítico o dos o más módulos críticos. Requiere evaluación de suscripción (nivel 2). |
| Exclusión de política (`s6`) | Exclusión de política | Sí | O | Políticas de suscripción vigentes | Todos | Todos |  |  |
