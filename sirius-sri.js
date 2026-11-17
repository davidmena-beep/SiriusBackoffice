// SIRIUS · Consulta de comprobantes electrónicos en el SRI (v1.1 · provisional · etapas P-6g-1b y P-6g-1c · DEC-247).
// Interfaz: SIRIUS_SRI.consultar(clave) → Promise<{ ok: true, estado, ruc, numero, fecha, subtotal, iva, total } | { ok: false, mensaje }>.
// En el prototipo la consulta es simulada: responde con las facturas registradas con SIRIUS_SRI.registrar(clave, datos) (las arman las escenas).
// Para el servicio real, se asigna SIRIUS_SRI.servicio = (clave) => Promise<{ estado, ruc, numero, fecha, subtotal, iva, total }> y consultar lo usa
// (la autorización del SRI devuelve el XML del comprobante: estado, ruc del emisor, estab-ptoEmi-secuencial, fechaEmision, totalSinImpuestos, IVA e importeTotal).
// Clave de acceso (49 dígitos): fecha ddmmaaaa (8) · tipo de comprobante (2; 01 = factura) · RUC del emisor (13) · ambiente (1) · serie estab+pto (6) ·
// secuencial (9) · código numérico (8) · tipo de emisión (1) · dígito verificador módulo 11 (1).
(function () {
  'use strict';
  const W = window; if (W.SIRIUS_SRI) return;
  const R = {};
  const dv = (s48) => { let suma = 0, f = 2; for (let i = s48.length - 1; i >= 0; i--) { suma += Number(s48[i]) * f; f = f === 7 ? 2 : f + 1; } const d = 11 - (suma % 11); return d === 11 ? 0 : d === 10 ? 1 : d; };
  const S = {
    validarClave: (c) => { c = String(c || '').replace(/\s/g, ''); if (!/^\d+$/.test(c)) return 'La clave de acceso solo lleva números.'; if (c.length !== 49) return 'La clave de acceso tiene 49 dígitos (escribiste ' + c.length + ').';
      if (dv(c.slice(0, 48)) !== Number(c[48])) return 'La clave de acceso no es válida: el dígito verificador no coincide.'; if (c.slice(8, 10) !== '01') return 'La clave de acceso no es de una factura (tipo de comprobante ' + c.slice(8, 10) + ').'; return ''; },
    desarmar: (c) => ({ fecha: c.slice(4, 8) + '-' + c.slice(2, 4) + '-' + c.slice(0, 2), tipo: c.slice(8, 10), ruc: c.slice(10, 23), ambiente: c.slice(23, 24), numero: c.slice(24, 27) + '-' + c.slice(27, 30) + '-' + c.slice(30, 39), codigo: c.slice(39, 47), emision: c.slice(47, 48) }),
    // Arma una clave válida (para las escenas de prueba).
    clave: (o) => { const f = String(o.fecha || '2026-10-18'), s = f.slice(8, 10) + f.slice(5, 7) + f.slice(0, 4) + '01' + String(o.ruc).padStart(13, '0') + (o.ambiente || '1') + String(o.serie || '001001').padStart(6, '0') + String(o.secuencial || 1).padStart(9, '0') + String(o.codigo || '12345678').padStart(8, '0') + '1'; return s + dv(s); },
    registrar: (clave, datos) => { R[String(clave)] = Object.assign({}, datos); },
    registradas: () => Object.keys(R),
    // Lo que respondería el SRI para la clave (síncrono; la base simulada lo usa al recibir enviarFactura). null si no está autorizada.
    registro: (clave) => { const c = String(clave || '').replace(/\s/g, ''), x = R[c]; if (!x || S.validarClave(c)) return null; const d = S.desarmar(c); return Object.assign({ estado: 'AUTORIZADO', ruc: d.ruc, numero: d.numero, fecha: d.fecha, clave: c }, x); },
    servicio: null,
    consultar: (clave) => { const c = String(clave || '').replace(/\s/g, ''), e = S.validarClave(c); if (e) return Promise.resolve({ ok: false, mensaje: e });
      if (typeof S.servicio === 'function') return Promise.resolve(S.servicio(c)).then((r) => Object.assign({ ok: true }, r), (er) => ({ ok: false, mensaje: 'El SRI no respondió: ' + ((er && er.message) || er) }));
      const x = R[c]; if (!x) return Promise.resolve({ ok: false, mensaje: 'El SRI no tiene un comprobante autorizado con esa clave de acceso (consulta simulada).' });
      const d = S.desarmar(c); return new Promise((ok) => setTimeout(() => ok(Object.assign({ ok: true, estado: 'AUTORIZADO', ruc: d.ruc, numero: d.numero, fecha: d.fecha, clave: c }, x)), 250)); },
  };
  W.SIRIUS_SRI = S;
})();
