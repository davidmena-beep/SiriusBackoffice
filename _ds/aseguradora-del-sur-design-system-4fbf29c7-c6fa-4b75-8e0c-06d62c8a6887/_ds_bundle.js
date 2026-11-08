/* @ds-bundle: {"format":4,"namespace":"AseguradoraDelSurDesignSystem_4fbf29","components":[{"name":"LoginForm","sourcePath":"components/auth/LoginForm.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Snackbar","sourcePath":"components/feedback/Snackbar.jsx"},{"name":"Spinner","sourcePath":"components/feedback/Spinner.jsx"},{"name":"FeedbackIcon","sourcePath":"components/feedback/icons.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"SideNav","sourcePath":"components/navigation/SideNav.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/auth/LoginForm.jsx":"2520ea29d0c4","components/buttons/Button.jsx":"57b945fee117","components/display/Avatar.jsx":"37533b3b533d","components/display/Badge.jsx":"5b609dd34fc5","components/display/Card.jsx":"ef8fbc4d6ff8","components/feedback/Alert.jsx":"0e76c00c36ab","components/feedback/Modal.jsx":"3c4e9ea5f89e","components/feedback/Snackbar.jsx":"fbbba11ad414","components/feedback/Spinner.jsx":"292395ab1820","components/feedback/icons.jsx":"587116d49dfb","components/forms/Checkbox.jsx":"abc71f92cfdf","components/forms/Input.jsx":"f1f99913b367","components/forms/Radio.jsx":"efd7ec86cdb4","components/forms/Switch.jsx":"133542373a7f","components/navigation/SideNav.jsx":"60dcaee15d98","components/navigation/Tabs.jsx":"516f8e1e6fcc","ui_kits/login/LoginScreen.jsx":"396f358c3ecd","ui_kits/login/image-slot.js":"fff26d081c8d","ui_kits/renovaciones/DetallesModal.jsx":"eeab3f05df04","ui_kits/renovaciones/NuevoPedidoModal.jsx":"26db2a591e45","ui_kits/renovaciones/RenovacionesFooter.jsx":"3c63889574de","ui_kits/renovaciones/RenovacionesTable.jsx":"7db36c1214b4","ui_kits/renovaciones/TopBar.jsx":"7b8d33c29bfe","ui_kits/siniestros/ClaimsPortal.jsx":"39d018e0b9f9","ui_kits/siniestros/PortalHeader.jsx":"80feec89c5e8","ui_kits/website/FeaturesSection.jsx":"52161e7a4252","ui_kits/website/Footer.jsx":"34dd4b833c5b","ui_kits/website/Footer.standalone.jsx":"3ee6e2b018d1","ui_kits/website/Header.jsx":"dc19f5e1163d","ui_kits/website/Header.standalone.jsx":"9df206a7c5fa","ui_kits/website/Hero.jsx":"a0e114a85148","ui_kits/website/Hero.standalone.jsx":"16fae0a76125","ui_kits/website/PricingSection.jsx":"6fa9d1e15e20","ui_kits/website/SegurosSection.jsx":"b1d5aee13461"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AseguradoraDelSurDesignSystem_4fbf29 = window.AseguradoraDelSurDesignSystem_4fbf29 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Avatar.jsx
try { (() => {
/** Avatar — circular user mark. Shows image when src given, else initials on navy. */
function Avatar({
  src,
  name = '',
  size = 40,
  style = {}
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--blue-900)',
      color: '#fff',
      flex: '0 0 auto',
      fontFamily: 'var(--font-brand)',
      fontWeight: 'var(--fw-bold)',
      fontSize: size * 0.38,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials || '?');
}
Object.assign(__ds_scope, { Avatar, __ds_default_components_display_Avatar_1dmo83i: Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
/**
 * Badge — small pill label for statuses, tags, and counts.
 * tone: 'brand' | 'success' | 'warning' | 'danger' | 'teal' | 'neutral'
 * variant: 'soft' (tinted bg) | 'solid' (filled)
 */
function Badge({
  children,
  tone = 'brand',
  variant = 'soft',
  iconLeft,
  style = {}
}) {
  const map = {
    brand: {
      fg: 'var(--cyan-700)',
      bg: 'var(--cyan-100)',
      solid: 'var(--color-brand)'
    },
    success: {
      fg: 'var(--green-500)',
      bg: 'var(--green-100)',
      solid: 'var(--green-500)'
    },
    warning: {
      fg: 'var(--gold-500)',
      bg: 'var(--gold-100)',
      solid: 'var(--gold-500)'
    },
    danger: {
      fg: 'var(--red-500)',
      bg: 'var(--red-100)',
      solid: 'var(--red-500)'
    },
    teal: {
      fg: 'var(--teal-500)',
      bg: 'var(--teal-100)',
      solid: 'var(--teal-500)'
    },
    neutral: {
      fg: 'var(--neutral-700)',
      bg: 'var(--neutral-100)',
      solid: 'var(--neutral-600)'
    }
  };
  const c = map[tone] || map.brand;
  const solid = variant === 'solid';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      padding: '3px 10px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-brand)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-caption)',
      lineHeight: 1.4,
      color: solid ? '#fff' : c.fg,
      background: solid ? c.solid : c.bg,
      ...style
    }
  }, iconLeft, children);
}
Object.assign(__ds_scope, { Badge, __ds_default_components_display_Badge_1ieegi: Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — white surface container with the ADS "Caja" elevation.
 * elevation: 'sm' (cajita) | 'md' (caja) | 'flat' (border only).
 */
function Card({
  children,
  elevation = 'md',
  padding = 'var(--space-6)',
  radius = 'var(--radius-md)',
  style = {},
  ...rest
}) {
  const shadows = {
    flat: 'none',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface-page)',
      borderRadius: radius,
      boxShadow: shadows[elevation] || shadows.md,
      border: elevation === 'flat' ? '1px solid var(--border-subtle)' : 'none',
      padding,
      boxSizing: 'border-box',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card, __ds_default_components_display_Card_4cna3d: Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Spinner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Spinner — indeterminate loader for a specific element (button, card, table cell).
 * Cyan arc over a cyan-wash track. Announces itself to screen readers via role="status".
 */
function Spinner({
  size = 'md',
  // 'sm' | 'md' | 'lg' | number (px)
  tone = 'brand',
  // 'brand' | 'onBrand' | 'current'
  label = 'Cargando',
  showLabel = false,
  className = '',
  style = {},
  ...rest
}) {
  const px = typeof size === 'number' ? size : {
    sm: 16,
    md: 24,
    lg: 40
  }[size] || 24;
  const stroke = px <= 16 ? 2 : px <= 24 ? 2.5 : 3.5;
  const r = (px - stroke) / 2;
  const c = 2 * Math.PI * r;
  const colors = {
    brand: {
      track: 'var(--spinner-track)',
      arc: 'var(--spinner-arc)'
    },
    onBrand: {
      track: 'rgba(255,255,255,.35)',
      arc: 'var(--white)'
    },
    current: {
      track: 'currentColor',
      arc: 'currentColor',
      trackOpacity: 0.25
    }
  }[tone] || {};
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "status",
    "aria-live": "polite",
    className: `ads-spinner ads-spinner--${tone} ${className}`.trim(),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      lineHeight: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: px,
    height: px,
    viewBox: `0 0 ${px} ${px}`,
    "aria-hidden": "true",
    focusable: "false"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: px / 2,
    cy: px / 2,
    r: r,
    fill: "none",
    stroke: colors.track,
    strokeOpacity: colors.trackOpacity ?? 1,
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    className: "ads-spinner__arc",
    cx: px / 2,
    cy: px / 2,
    r: r,
    fill: "none",
    stroke: colors.arc,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: `${c * 0.28} ${c}`,
    style: {
      transformOrigin: 'center',
      animation: 'ads-spin var(--dur-spin) linear infinite'
    }
  })), showLabel ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-body)',
      lineHeight: 1.5
    }
  }, label) : /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap'
    }
  }, label));
}
Object.assign(__ds_scope, { Spinner, __ds_default_components_feedback_Spinner_10l44jx: Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Spinner.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — primary call-to-action for Aseguradora del Sur.
 * Cyan brand fill by default; rounded 8px; Mulish medium 16px.
 * `unavailableReason`: control que no aplica pero tiene motivo. NO usa disabled: sigue enfocable, no ejecuta onClick, aria-disabled="true", y muestra el motivo en un tooltip (role=tooltip) al foco/hover; Esc lo oculta.
 * `loading` swaps content for a Spinner, keeps the width, blocks clicks and sets aria-busy.
 */
function Button({
  children,
  variant = 'primary',
  // 'primary' | 'secondary' | 'ghost' | 'link'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  iconLeft,
  iconRight,
  disabled = false,
  loading = false,
  loadingText,
  unavailableReason,
  fullWidth = false,
  type = 'button',
  onClick,
  style = {},
  className = '',
  ...rest
}) {
  const sizes = {
    sm: {
      height: 36,
      padding: '0 16px',
      font: 14,
      spin: 16
    },
    md: {
      height: 40,
      padding: '0 20px',
      font: 16,
      spin: 18
    },
    lg: {
      height: 48,
      padding: '0 28px',
      font: 16,
      spin: 20
    }
  };
  const s = sizes[size] || sizes.md;
  const unavailable = !!unavailableReason && !disabled && !loading;
  const [tip, setTip] = React.useState({
    hover: false,
    focus: false,
    esc: false
  });
  const tipId = React.useId();
  const showTip = unavailable && !tip.esc && (tip.hover || tip.focus);
  const inactive = disabled || loading || unavailable;
  const base = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-brand)',
    fontWeight: 'var(--fw-medium)',
    fontSize: s.font,
    lineHeight: 1,
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid transparent',
    cursor: disabled || unavailable ? 'not-allowed' : loading ? 'progress' : 'pointer',
    transition: 'var(--transition-action)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    boxSizing: 'border-box'
  };
  const variants = {
    primary: {
      background: 'var(--color-brand)',
      color: 'var(--text-on-brand)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-brand-dark)',
      borderColor: 'var(--color-brand)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-strong)'
    },
    link: {
      background: 'transparent',
      color: 'var(--text-link)',
      height: 'auto',
      padding: '0',
      borderRadius: 0,
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  };
  const disabledStyle = disabled || unavailable ? variant === 'primary' ? {
    background: 'var(--neutral-300)',
    color: 'var(--neutral-500)',
    boxShadow: 'none'
  } : {
    color: 'var(--neutral-400)',
    borderColor: 'var(--neutral-300)',
    textDecoration: 'none'
  } : {};
  const loadingStyle = loading && !disabled && !unavailable ? {
    opacity: 'var(--button-loading-opacity)'
  } : {};
  const merged = {
    ...base,
    ...variants[variant],
    ...disabledStyle,
    ...loadingStyle,
    ...style
  };
  function onEnter(e) {
    if (inactive) return;
    if (variant === 'primary') {
      e.currentTarget.style.background = 'var(--color-brand-dark)';
      e.currentTarget.style.boxShadow = 'var(--shadow-button)';
    } else if (variant === 'secondary') {
      e.currentTarget.style.background = 'var(--color-brand-wash)';
    } else if (variant === 'ghost') {
      e.currentTarget.style.background = 'var(--neutral-100)';
    } else if (variant === 'link') {
      e.currentTarget.style.opacity = '0.7';
    }
  }
  function onLeave(e) {
    if (inactive) return;
    e.currentTarget.style.background = merged.background;
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.opacity = '1';
  }
  const spinner = /*#__PURE__*/React.createElement(__ds_scope.Spinner, {
    size: s.spin,
    tone: variant === 'primary' ? 'onBrand' : 'current',
    label: loadingText || 'Cargando'
  });
  let content;
  if (loading && loadingText) {
    content = /*#__PURE__*/React.createElement(React.Fragment, null, spinner, /*#__PURE__*/React.createElement("span", null, loadingText));
  } else if (loading) {
    content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        visibility: 'hidden'
      }
    }, iconLeft, children, iconRight), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, spinner));
  } else {
    content = /*#__PURE__*/React.createElement(React.Fragment, null, iconLeft, children, iconRight);
  }
  const btn = /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    "aria-disabled": loading || unavailable || undefined,
    "aria-describedby": unavailable ? tipId : rest['aria-describedby'],
    "aria-busy": loading || undefined,
    className: `ads-button ads-button--${variant} ads-button--${size}${loading ? ' ads-button--loading' : ''} ${className}`.trim(),
    style: merged,
    onMouseEnter: e => {
      onEnter(e);
      if (unavailable) setTip(t => ({
        ...t,
        hover: true
      }));
    },
    onMouseLeave: e => {
      onLeave(e);
      if (unavailable) setTip({
        hover: false,
        focus: tip.focus,
        esc: false
      });
    },
    onFocus: e => {
      if (unavailable) setTip(t => ({
        ...t,
        focus: true,
        esc: false
      }));
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      if (unavailable) setTip(t => ({
        ...t,
        focus: false
      }));
      rest.onBlur && rest.onBlur(e);
    },
    onKeyDown: e => {
      if (unavailable && e.key === 'Escape') setTip(t => ({
        ...t,
        esc: true
      }));
      rest.onKeyDown && rest.onKeyDown(e);
    },
    onClick: e => {
      if (loading || unavailable) {
        e.preventDefault();
        return;
      }
      onClick && onClick(e);
    }
  }, rest), content);
  if (!unavailableReason) return btn;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : 'auto'
    }
  }, btn, /*#__PURE__*/React.createElement("span", {
    id: tipId,
    role: "tooltip",
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      visibility: showTip ? 'visible' : 'hidden',
      pointerEvents: 'none',
      zIndex: 10,
      background: 'var(--neutral-900, #011e41)',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      lineHeight: 1.3,
      padding: '6px 10px',
      borderRadius: 'var(--radius-xs)',
      maxWidth: 260,
      width: 'max-content',
      textAlign: 'center'
    }
  }, unavailableReason));
}
Object.assign(__ds_scope, { Button, __ds_default_components_buttons_Button_1babiwk: Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/feedback/icons.jsx
try { (() => {
// Lucide icon geometry (lucide.dev, ISC) — 24px grid, 2px stroke, round caps.
const paths = {
  info: [['circle', {
    cx: 12,
    cy: 12,
    r: 10
  }], ['path', {
    d: 'M12 16v-4'
  }], ['path', {
    d: 'M12 8h.01'
  }]],
  success: [['circle', {
    cx: 12,
    cy: 12,
    r: 10
  }], ['path', {
    d: 'm9 12 2 2 4-4'
  }]],
  warning: [['path', {
    d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3'
  }], ['path', {
    d: 'M12 9v4'
  }], ['path', {
    d: 'M12 17h.01'
  }]],
  danger: [['circle', {
    cx: 12,
    cy: 12,
    r: 10
  }], ['path', {
    d: 'm15 9-6 6'
  }], ['path', {
    d: 'm9 9 6 6'
  }]],
  close: [['path', {
    d: 'M18 6 6 18'
  }], ['path', {
    d: 'm6 6 12 12'
  }]],
  eye: [['path', {
    d: 'M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0'
  }], ['circle', {
    cx: 12,
    cy: 12,
    r: 3
  }]],
  eyeOff: [['path', {
    d: 'M10.73 5.08A10.43 10.43 0 0 1 12 5c4.46 0 8.4 2.9 9.94 6.65a1 1 0 0 1 0 .7 10.75 10.75 0 0 1-1.44 2.49'
  }], ['path', {
    d: 'M14.08 14.16a3 3 0 0 1-4.24-4.24'
  }], ['path', {
    d: 'M17.48 17.5A10.75 10.75 0 0 1 2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 4.45-5.14'
  }], ['path', {
    d: 'm2 2 20 20'
  }]],
  mail: [['rect', {
    x: 2,
    y: 4,
    width: 20,
    height: 16,
    rx: 2
  }], ['path', {
    d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'
  }]],
  capsLock: [['path', {
    d: 'M12 3 4 11h4v4h8v-4h4z'
  }], ['path', {
    d: 'M8 20h8'
  }]],
  chevronLeft: [['path', {
    d: 'm15 18-6-6 6-6'
  }]],
  chevronRight: [['path', {
    d: 'm9 18 6-6-6-6'
  }]],
  clipboard: [['rect', {
    x: 8,
    y: 2,
    width: 8,
    height: 4,
    rx: 1,
    ry: 1
  }], ['path', {
    d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'
  }], ['path', {
    d: 'M12 11h4'
  }], ['path', {
    d: 'M12 16h4'
  }], ['path', {
    d: 'M8 11h.01'
  }], ['path', {
    d: 'M8 16h.01'
  }]],
  sliders: [['path', {
    d: 'M21 4h-7'
  }], ['path', {
    d: 'M10 4H3'
  }], ['path', {
    d: 'M21 12h-9'
  }], ['path', {
    d: 'M8 12H3'
  }], ['path', {
    d: 'M21 20h-5'
  }], ['path', {
    d: 'M12 20H3'
  }], ['path', {
    d: 'M14 2v4'
  }], ['path', {
    d: 'M8 10v4'
  }], ['path', {
    d: 'M16 18v4'
  }]],
  lock: [['rect', {
    x: 3,
    y: 11,
    width: 18,
    height: 11,
    rx: 2,
    ry: 2
  }], ['path', {
    d: 'M7 11V7a5 5 0 0 1 10 0v4'
  }]],
  heart: [['path', {
    d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'
  }]],
  settings: [['path', {
    d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'
  }], ['circle', {
    cx: 12,
    cy: 12,
    r: 3
  }]],
  banknote: [['rect', {
    x: 2,
    y: 6,
    width: 20,
    height: 12,
    rx: 2
  }], ['circle', {
    cx: 12,
    cy: 12,
    r: 2
  }], ['path', {
    d: 'M6 12h.01M18 12h.01'
  }]],
  users: [['path', {
    d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'
  }], ['circle', {
    cx: 9,
    cy: 7,
    r: 4
  }], ['path', {
    d: 'M22 21v-2a4 4 0 0 0-3-3.87'
  }], ['path', {
    d: 'M16 3.13a4 4 0 0 1 0 7.75'
  }]],
  home: [['path', {
    d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'
  }], ['path', {
    d: 'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
  }]],
  fileText: [['path', {
    d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'
  }], ['path', {
    d: 'M14 2v4a2 2 0 0 0 2 2h4'
  }], ['path', {
    d: 'M10 9H8'
  }], ['path', {
    d: 'M16 13H8'
  }], ['path', {
    d: 'M16 17H8'
  }]],
  shield: [['path', {
    d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'
  }]],
  chart: [['path', {
    d: 'M3 3v18h18'
  }], ['path', {
    d: 'M18 17V9'
  }], ['path', {
    d: 'M13 17V5'
  }], ['path', {
    d: 'M8 17v-3'
  }]],
  search: [['circle', {
    cx: 11,
    cy: 11,
    r: 8
  }], ['path', {
    d: 'm21 21-4.3-4.3'
  }]],
  plus: [['path', {
    d: 'M5 12h14'
  }], ['path', {
    d: 'M12 5v14'
  }]],
  chevronDown: [['path', {
    d: 'm6 9 6 6 6-6'
  }]]
};
function FeedbackIcon({
  name,
  size = 20,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
    style: {
      flex: '0 0 auto',
      ...style
    }
  }, (paths[name] || []).map(([tag, attrs], i) => React.createElement(tag, {
    key: i,
    ...attrs
  })));
}
Object.assign(__ds_scope, { FeedbackIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/icons.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Alert — inline validation & feedback message for forms and sections.
 * Soft tinted surface, tone-colored icon, navy text (keeps 4.5:1 contrast).
 */
function Alert({
  tone = 'info',
  // 'info' | 'success' | 'warning' | 'danger'
  title,
  children,
  size = 'md',
  // 'md' block · 'sm' compact (field-level)
  icon,
  action,
  onClose,
  closeLabel = 'Cerrar aviso',
  live,
  id,
  className = '',
  style = {},
  ...rest
}) {
  const t = ['info', 'success', 'warning', 'danger'].includes(tone) ? tone : 'info';
  const assertive = t === 'danger' || t === 'warning';
  const sm = size === 'sm';
  return /*#__PURE__*/React.createElement("div", _extends({
    id: id,
    role: assertive ? 'alert' : 'status',
    "aria-live": live || (assertive ? 'assertive' : 'polite'),
    className: `ads-alert ads-alert--${t} ads-alert--${sm ? 'sm' : 'md'} ${className}`.trim(),
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: sm ? 'var(--space-2)' : 'var(--alert-gap)',
      padding: sm ? 'var(--alert-padding-sm)' : 'var(--alert-padding)',
      borderRadius: 'var(--alert-radius)',
      background: `var(--alert-${t}-bg)`,
      fontFamily: 'var(--font-body)',
      boxSizing: 'border-box',
      width: '100%',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      color: `var(--alert-${t}-fg)`,
      display: 'inline-flex',
      paddingTop: sm ? 1 : 2
    }
  }, icon === null ? null : icon || /*#__PURE__*/React.createElement(__ds_scope.FeedbackIcon, {
    name: t,
    size: sm ? 16 : 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, title && /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: sm ? 14 : 16,
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      lineHeight: 1.4
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: sm ? 12 : 14,
      color: 'var(--text-strong)',
      lineHeight: 1.5
    }
  }, children), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)',
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, action)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": closeLabel,
    style: {
      appearance: 'none',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: 2,
      margin: -2,
      color: 'var(--neutral-600)',
      display: 'inline-flex',
      borderRadius: 'var(--radius-xs)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FeedbackIcon, {
    name: "close",
    size: sm ? 16 : 18
  })));
}
Object.assign(__ds_scope, { Alert, __ds_default_components_feedback_Alert_s1ujgm: Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Modal — dialog over a dimmed scrim. White card, 24px radius, 40px padding,
 * centered bold title, × in the top-right. Traps focus, closes on Esc / scrim.
 */
function Modal({
  open = false,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  // 'sm' | 'md' | 'lg'
  align = 'center',
  // title alignment: 'center' | 'left'
  closeOnOverlay = true,
  closeOnEsc = true,
  showClose = true,
  initialFocusRef,
  inline = false,
  // render in flow (docs/previews) instead of fixed overlay
  className = '',
  style = {},
  ...rest
}) {
  const dialogRef = React.useRef(null);
  const uid = React.useId ? React.useId() : 'm';
  const titleId = `ads-modal-title-${uid}`;
  const descId = `ads-modal-desc-${uid}`;
  React.useEffect(() => {
    if (!open || inline) return;
    const prev = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const node = dialogRef.current;
    const first = initialFocusRef && initialFocusRef.current || node && node.querySelector(FOCUSABLE) || node;
    first && first.focus();
    function onKey(e) {
      if (e.key === 'Escape' && closeOnEsc && onClose) {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && node) {
        const f = Array.from(node.querySelectorAll(FOCUSABLE));
        if (!f.length) {
          e.preventDefault();
          return;
        }
        const a = f[0],
          z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prev && prev.focus && prev.focus();
    };
  }, [open, inline, closeOnEsc, onClose]);
  if (!open) return null;
  const width = `var(--modal-width-${['sm', 'md', 'lg'].includes(size) ? size : 'md'})`;
  const dialog = /*#__PURE__*/React.createElement("div", _extends({
    ref: dialogRef,
    role: "dialog",
    "aria-modal": inline ? undefined : 'true',
    "aria-labelledby": title ? titleId : undefined,
    "aria-describedby": description ? descId : undefined,
    tabIndex: -1,
    className: `ads-modal__dialog ads-modal--${size} ${className}`.trim(),
    onClick: e => e.stopPropagation(),
    style: {
      position: 'relative',
      width,
      maxWidth: '100%',
      boxSizing: 'border-box',
      background: 'var(--surface-page)',
      borderRadius: 'var(--modal-radius)',
      boxShadow: 'var(--modal-shadow)',
      padding: 'var(--modal-padding)',
      outline: 'none',
      fontFamily: 'var(--font-body)',
      animation: inline ? 'none' : 'ads-scale-in var(--dur-action) var(--ease-standard)',
      ...style
    }
  }, rest), showClose && onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Cerrar",
    style: {
      position: 'absolute',
      top: 20,
      right: 20,
      appearance: 'none',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--neutral-400)',
      padding: 0,
      display: 'inline-flex',
      borderRadius: 'var(--radius-xs)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = 'var(--text-strong)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = 'var(--neutral-400)';
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FeedbackIcon, {
    name: "close",
    size: 24
  })), (title || description) && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      marginBottom: 'var(--space-6)',
      padding: align === 'left' ? '0 32px 0 0' : '0 32px'
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    id: titleId,
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--modal-title-size)',
      lineHeight: 1.25,
      color: 'var(--text-strong)',
      margin: '0 0 4px'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    id: descId,
    style: {
      fontSize: 16,
      lineHeight: 1.5,
      color: 'var(--text-body)',
      margin: 0
    }
  }, description)), children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, footer));
  if (inline) return dialog;
  return /*#__PURE__*/React.createElement("div", {
    className: "ads-modal__scrim",
    onClick: () => closeOnOverlay && onClose && onClose(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 'var(--z-modal)',
      background: 'var(--modal-scrim)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '40px 20px',
      overflowY: 'auto',
      boxSizing: 'border-box',
      animation: 'ads-fade-in var(--dur-fast) var(--ease-gentle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 'auto 0',
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }
  }, dialog));
}
Object.assign(__ds_scope, { Modal, __ds_default_components_feedback_Modal_sadu4b: Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Snackbar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Snackbar — brief, transient notice at the bottom of the viewport.
 * Navy surface, white text, cyan action. Auto-dismisses; pauses on hover/focus.
 */
function Snackbar({
  open = false,
  message,
  tone = 'default',
  // 'default' | 'success' | 'danger'
  actionLabel,
  onAction,
  onClose,
  duration = 5000,
  // ms; 0/null = persistent
  position = 'bottom-center',
  // 'bottom-center' | 'bottom-left' | 'inline'
  showClose = true,
  className = '',
  style = {},
  ...rest
}) {
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (!open || !duration || paused || !onClose) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, paused, onClose]);
  React.useEffect(() => {
    if (!open || !onClose) return;
    const k = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open, onClose]);
  if (!open) return null;
  const pos = position === 'inline' ? {
    position: 'relative'
  } : position === 'bottom-left' ? {
    position: 'fixed',
    left: 'var(--snackbar-offset)',
    bottom: 'var(--snackbar-offset)'
  } : {
    position: 'fixed',
    left: '50%',
    bottom: 'var(--snackbar-offset)',
    translate: '-50% 0'
  };
  const iconColor = tone === 'success' ? 'var(--green-100)' : tone === 'danger' ? 'var(--red-100)' : null;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: tone === 'danger' ? 'alert' : 'status',
    "aria-live": tone === 'danger' ? 'assertive' : 'polite',
    "aria-atomic": "true",
    className: `ads-snackbar ads-snackbar--${tone} ${className}`.trim(),
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
    style: {
      ...pos,
      zIndex: position === 'inline' ? 'auto' : 'var(--z-snackbar)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      width: 'max-content',
      maxWidth: 'min(var(--snackbar-max-width), calc(100vw - 32px))',
      boxSizing: 'border-box',
      padding: 'var(--snackbar-padding)',
      borderRadius: 'var(--snackbar-radius)',
      background: 'var(--snackbar-bg)',
      color: 'var(--snackbar-fg)',
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.5,
      animation: 'ads-rise-in var(--dur-fast) var(--ease-gentle)',
      ...style
    }
  }, rest), iconColor && /*#__PURE__*/React.createElement("span", {
    style: {
      color: iconColor,
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FeedbackIcon, {
    name: tone,
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, message), actionLabel && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      appearance: 'none',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: '4px 6px',
      margin: '-4px 0',
      color: 'var(--snackbar-action)',
      fontFamily: 'var(--font-brand)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 14,
      borderRadius: 'var(--radius-xs)'
    }
  }, actionLabel), showClose && onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Cerrar notificaci\xF3n",
    style: {
      appearance: 'none',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: 4,
      margin: -4,
      color: 'var(--neutral-300)',
      display: 'inline-flex',
      borderRadius: 'var(--radius-xs)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FeedbackIcon, {
    name: "close",
    size: 18
  })));
}
Object.assign(__ds_scope, { Snackbar, __ds_default_components_feedback_Snackbar_mqxkab: Snackbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Snackbar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox — square selector with cyan fill + white check when on. Control nativo (input checkbox) oculto sobre el visual: operable con teclado, foco visible, rol/estado anunciados. unavailableReason: enfocable, no cambia, aria-disabled, tooltip con el motivo al foco/hover (Esc oculta). Regla: si no aplica y tiene motivo, no usar disabled (ver Button.unavailableReason). */
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  unavailableReason,
  style = {},
  ...rest
}) {
  const unavailable = !!unavailableReason && !disabled;
  const [tip, setTip] = React.useState({
    hover: false,
    focus: false,
    esc: false
  });
  const tipId = React.useId();
  const tipRef = React.useRef(null);
  const [shift, setShift] = React.useState(0);
  const showTip = unavailable && !tip.esc && (tip.hover || tip.focus);
  const [focus, setFocus] = React.useState(false);
  const fv = e => setFocus(e.target.matches(':focus-visible'));
  React.useLayoutEffect(() => {
    if (!showTip || !tipRef.current) return;
    const el = tipRef.current;
    el.style.marginLeft = '0px';
    const r = el.getBoundingClientRect();
    const m = 8,
      vw = document.documentElement.clientWidth;
    setShift(r.left < m ? m - r.left : r.right > vw - m ? vw - m - r.right : 0);
  }, [showTip, unavailableReason]);
  const control = /*#__PURE__*/React.createElement("label", {
    onMouseEnter: unavailable ? () => setTip(t => ({
      ...t,
      hover: true
    })) : undefined,
    onMouseLeave: unavailable ? () => setTip(t => ({
      ...t,
      hover: false,
      esc: false
    })) : undefined,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      cursor: disabled || unavailable ? 'not-allowed' : 'pointer',
      opacity: disabled || unavailable ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 20,
      height: 20,
      flex: '0 0 auto',
      boxSizing: 'border-box',
      borderRadius: 'var(--radius-xs)',
      border: `2px solid ${checked ? 'var(--color-brand)' : 'var(--border-strong)'}`,
      background: checked ? 'var(--color-brand)' : 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-action)',
      outline: focus ? '2px solid var(--color-brand-dark)' : 'none',
      outlineOffset: 2
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "checkbox",
    checked: checked,
    disabled: disabled,
    "aria-disabled": unavailable || undefined,
    "aria-describedby": unavailable ? tipId : rest['aria-describedby'],
    onChange: e => {
      if (unavailable) return;
      onChange && onChange(e.target.checked);
    },
    onClick: e => {
      if (unavailable) e.preventDefault();
    },
    onFocus: e => {
      fv(e);
      if (unavailable) setTip(t => ({
        ...t,
        focus: true,
        esc: false
      }));
    },
    onBlur: () => {
      setFocus(false);
      if (unavailable) setTip(t => ({
        ...t,
        focus: false
      }));
    },
    onKeyDown: e => {
      if (unavailable && e.key === 'Escape') setTip(t => ({
        ...t,
        esc: true
      }));
    },
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      margin: 0,
      opacity: 0,
      cursor: 'inherit',
      zIndex: 1
    }
  }, rest)), checked && /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)'
    }
  }, label));
  if (!unavailableReason) return control;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, control, /*#__PURE__*/React.createElement("span", {
    ref: tipRef,
    id: tipId,
    role: "tooltip",
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      marginLeft: shift,
      textAlign: 'center',
      visibility: showTip ? 'visible' : 'hidden',
      pointerEvents: 'none',
      zIndex: 10,
      background: 'var(--neutral-900, #011e41)',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      lineHeight: 1.3,
      padding: '6px 10px',
      borderRadius: 'var(--radius-xs)',
      maxWidth: 260,
      width: 'max-content'
    }
  }, unavailableReason));
}
Object.assign(__ds_scope, { Checkbox, __ds_default_components_forms_Checkbox_i1jt6f: Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — underline text field matching the ADS form style.
 * Label above; cyan underline on focus; red on error; green on validated success.
 * Adds: onBlur/onChange/onSubmit validation, browser autofill detection & styling,
 * and Caps Lock (Bloq Mayús) detection.
 */
function Input({
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  placeholder = '',
  type = 'text',
  name,
  id,
  iconRight,
  helper,
  error,
  success,
  required = false,
  disabled = false,
  readOnly = false,
  validate,
  validateOn = 'blur',
  // 'blur' | 'change' | 'submit'
  showSuccess = false,
  autoComplete,
  onAutofill,
  detectCapsLock,
  // default: true for password fields
  capsLockMessage = 'Bloq Mayús está activado',
  variant = 'underline',
  // 'underline' | 'outlined'
  hideLabel,
  // default: true for outlined (label becomes placeholder + aria)
  passwordToggle,
  // default: true for password fields
  style = {},
  className = '',
  ...rest
}) {
  const uid = React.useId ? React.useId() : 'in';
  const inputId = id || `ads-input-${uid}`;
  const [focused, setFocused] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const [internalError, setInternalError] = React.useState('');
  const [validated, setValidated] = React.useState(false);
  const [autofilled, setAutofilled] = React.useState(false);
  const [capsOn, setCapsOn] = React.useState(false);
  const [reveal, setReveal] = React.useState(false);
  const isPassword = type === 'password';
  const capsEnabled = detectCapsLock ?? isPassword;
  const outlined = variant === 'outlined';
  const labelHidden = hideLabel ?? outlined;
  const toggleEnabled = isPassword && (passwordToggle ?? true);
  const inputType = isPassword && reveal ? 'text' : type;
  function runValidation(v) {
    if (!validate) return;
    const msg = validate(v) || '';
    setInternalError(msg);
    setValidated(true);
  }
  function handleBlur(e) {
    setFocused(false);
    setCapsOn(false);
    setTouched(true);
    if (validateOn === 'blur') runValidation(e.target.value);
    onBlur && onBlur(e);
  }
  function handleChange(e) {
    if (validateOn === 'change' || validateOn === 'blur' && touched && internalError) runValidation(e.target.value);
    if (autofilled && e.nativeEvent && e.nativeEvent.inputType) setAutofilled(false);
    onChange && onChange(e);
  }
  function handleKey(e, cb) {
    if (capsEnabled && e.getModifierState) setCapsOn(e.getModifierState('CapsLock'));
    cb && cb(e);
  }
  function handleAnimation(e) {
    if (e.animationName === 'ads-autofill-start') {
      setAutofilled(true);
      onAutofill && onAutofill(true);
    }
    if (e.animationName === 'ads-autofill-cancel' && autofilled) {
      setAutofilled(false);
      onAutofill && onAutofill(false);
    }
  }
  const shownError = error || (validateOn !== 'submit' || touched ? internalError : '');
  const isSuccess = !shownError && (success || showSuccess && validated && !!value);
  const underline = shownError ? 'var(--color-danger)' : focused ? 'var(--color-brand)' : isSuccess ? 'var(--input-success)' : 'var(--border-strong)';
  const state = disabled ? 'disabled' : shownError ? 'error' : isSuccess ? 'success' : focused ? 'focus' : 'default';
  const msgId = `${inputId}-msg`;
  const capsId = `${inputId}-caps`;
  const describedBy = [(shownError || helper || isSuccess && typeof success === 'string') && msgId, capsOn && capsId].filter(Boolean).join(' ') || undefined;
  const msg = shownError || (isSuccess && typeof success === 'string' ? success : helper);
  const msgColor = shownError ? 'var(--color-danger)' : isSuccess && typeof success === 'string' ? 'var(--input-success)' : 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("div", {
    className: `ads-input ads-input--${state}${autofilled ? ' ads-input--autofilled' : ''}${capsOn ? ' ads-input--capslock' : ''} ${className}`.trim(),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
      width: '100%',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: labelHidden ? {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap'
    } : {
      fontFamily: 'var(--font-brand)',
      fontSize: 14,
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-strong)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: 'var(--color-danger)'
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: outlined ? {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      height: 'var(--input-outlined-height)',
      padding: '0 12px',
      boxSizing: 'border-box',
      border: `1px solid ${underline === 'var(--border-strong)' ? 'var(--input-outlined-border)' : underline}`,
      boxShadow: underline !== 'var(--border-strong)' ? `inset 0 0 0 0.5px ${underline}` : 'none',
      borderRadius: 'var(--radius-sm)',
      background: autofilled ? 'var(--input-autofill-bg)' : 'var(--surface-page)',
      transition: 'var(--transition-action)'
    } : {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      borderBottom: `2px solid ${underline}`,
      padding: '6px 2px',
      background: autofilled ? 'var(--input-autofill-bg)' : 'transparent',
      borderRadius: autofilled ? 'var(--radius-xs) var(--radius-xs) 0 0' : 0,
      transition: 'var(--transition-action)'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    name: name,
    className: "ads-input__control",
    type: inputType,
    value: value,
    onChange: handleChange,
    placeholder: placeholder || (labelHidden ? label : ''),
    disabled: disabled,
    readOnly: readOnly,
    required: required,
    autoComplete: autoComplete,
    "aria-invalid": shownError ? 'true' : undefined,
    "aria-required": required || undefined,
    "aria-describedby": describedBy,
    onFocus: e => {
      setFocused(true);
      onFocus && onFocus(e);
    },
    onBlur: handleBlur,
    onKeyDown: e => handleKey(e, onKeyDown),
    onKeyUp: e => handleKey(e, onKeyUp),
    onAnimationStart: handleAnimation,
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-strong)',
      minWidth: 0
    }
  }, rest)), capsOn && /*#__PURE__*/React.createElement("span", {
    title: capsLockMessage,
    style: {
      color: 'var(--input-capslock-fg)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FeedbackIcon, {
    name: "capsLock",
    size: 18
  })), toggleEnabled ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setReveal(r => !r),
    disabled: disabled,
    "aria-label": reveal ? 'Ocultar contraseña' : 'Mostrar contraseña',
    "aria-pressed": reveal,
    "aria-controls": inputId,
    style: {
      appearance: 'none',
      border: 'none',
      background: 'transparent',
      padding: 2,
      margin: -2,
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'inline-flex',
      borderRadius: 'var(--radius-xs)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FeedbackIcon, {
    name: reveal ? 'eye' : 'eyeOff',
    size: 22
  })) : iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      display: 'inline-flex'
    }
  }, iconRight)), capsOn && /*#__PURE__*/React.createElement("span", {
    id: capsId,
    role: "status",
    "aria-live": "polite",
    style: {
      alignSelf: 'flex-start',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '2px 8px',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--input-capslock-bg)',
      color: 'var(--input-capslock-fg)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-caption)',
      fontWeight: 'var(--fw-semibold)'
    }
  }, capsLockMessage), msg && /*#__PURE__*/React.createElement("span", {
    id: msgId,
    role: shownError ? 'alert' : undefined,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-caption)',
      color: msgColor
    }
  }, msg));
}
Object.assign(__ds_scope, { Input, __ds_default_components_forms_Input_jsghkw: Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/auth/LoginForm.jsx
try { (() => {
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * LoginForm — "Iniciar sesión" panel: correo + contraseña (outlined), forgot link, Ingresar CTA.
 * Composes Input (onBlur validation, autofill, Bloq Mayús, eye toggle), Button (loading) and Alert.
 */
function LoginForm({
  title = 'Iniciar sesión',
  subtitle = 'Ingresa tu correo y contraseña',
  emailLabel = 'Correo',
  passwordLabel = 'Contraseña',
  submitLabel = 'Ingresar',
  forgotLabel = '¿Olvidaste tu contraseña?',
  forgotHref = '#',
  onForgotPassword,
  onSubmit,
  loading = false,
  error,
  defaultEmail = '',
  validateEmail = true,
  width,
  className = '',
  style = {}
}) {
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState('');
  const [emailOk, setEmailOk] = React.useState(!validateEmail || EMAIL_RE.test(defaultEmail));
  const alertRef = React.useRef(null);
  const uid = React.useId ? React.useId() : 'lf';
  const canSubmit = email.trim() && password && (!validateEmail || emailOk) && !loading;
  React.useEffect(() => {
    if (error && alertRef.current) alertRef.current.focus();
  }, [error]);
  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit && onSubmit({
      email: email.trim(),
      password
    });
  }
  return /*#__PURE__*/React.createElement("form", {
    noValidate: true,
    onSubmit: handleSubmit,
    "aria-labelledby": `${uid}-title`,
    "aria-busy": loading || undefined,
    className: `ads-login ${className}`.trim(),
    style: {
      width: width || 'var(--login-form-width)',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-brand)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    id: `${uid}-title`,
    style: {
      margin: '0 0 2px',
      fontWeight: 'var(--fw-regular)',
      fontSize: 'var(--login-title-size)',
      lineHeight: 1.25,
      color: 'var(--neutral-800)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 16,
      letterSpacing: '0.02em',
      lineHeight: 1.5,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap'
    }
  }, subtitle)), error && /*#__PURE__*/React.createElement("div", {
    ref: alertRef,
    tabIndex: -1,
    style: {
      outline: 'none',
      marginBottom: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Alert, {
    tone: "danger",
    size: "sm"
  }, error)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    variant: "outlined",
    label: emailLabel,
    type: "email",
    name: "email",
    inputMode: "email",
    autoComplete: "username",
    autoCapitalize: "none",
    spellCheck: false,
    required: true,
    value: email,
    onChange: e => {
      setEmail(e.target.value);
      if (validateEmail) setEmailOk(EMAIL_RE.test(e.target.value.trim()));
    },
    validate: validateEmail ? v => !v.trim() || EMAIL_RE.test(v.trim()) ? '' : 'Ingresa un correo válido' : undefined,
    iconRight: /*#__PURE__*/React.createElement(__ds_scope.FeedbackIcon, {
      name: "mail",
      size: 24
    }),
    disabled: loading
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    variant: "outlined",
    label: passwordLabel,
    type: "password",
    name: "password",
    autoComplete: "current-password",
    required: true,
    value: password,
    onChange: e => setPassword(e.target.value),
    disabled: loading
  })), /*#__PURE__*/React.createElement("a", {
    href: forgotHref,
    onClick: e => {
      if (onForgotPassword) {
        e.preventDefault();
        onForgotPassword(email);
      }
    },
    style: {
      alignSelf: 'flex-start',
      marginTop: 'var(--space-3)',
      fontSize: 16,
      letterSpacing: '0.02em',
      color: 'var(--color-brand)',
      textDecoration: 'underline',
      textUnderlineOffset: 3,
      textDecorationThickness: 1
    }
  }, forgotLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    type: "submit",
    variant: "primary",
    size: "lg",
    fullWidth: true,
    disabled: !canSubmit && !loading,
    loading: loading,
    style: {
      marginTop: 'var(--space-5)',
      fontSize: 18,
      ...(!canSubmit && !loading ? {
        background: 'var(--login-submit-disabled-bg)',
        color: 'var(--text-on-brand)',
        cursor: 'not-allowed'
      } : {})
    }
  }, submitLabel));
}
Object.assign(__ds_scope, { LoginForm, __ds_default_components_auth_LoginForm_ecwnuw: LoginForm });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/auth/LoginForm.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Radio — circular selector with cyan ring + dot when on. Control nativo (input radio) oculto sobre el visual: operable con teclado, foco visible, rol/estado anunciados. unavailableReason: enfocable, no cambia, aria-disabled, tooltip con el motivo al foco/hover (Esc oculta). Regla: si no aplica y tiene motivo, no usar disabled (ver Button.unavailableReason). */
function Radio({
  checked = false,
  onChange,
  label,
  name,
  disabled = false,
  unavailableReason,
  style = {},
  ...rest
}) {
  const unavailable = !!unavailableReason && !disabled;
  const [tip, setTip] = React.useState({
    hover: false,
    focus: false,
    esc: false
  });
  const tipId = React.useId();
  const tipRef = React.useRef(null);
  const [shift, setShift] = React.useState(0);
  const showTip = unavailable && !tip.esc && (tip.hover || tip.focus);
  const [focus, setFocus] = React.useState(false);
  const fv = e => setFocus(e.target.matches(':focus-visible'));
  React.useLayoutEffect(() => {
    if (!showTip || !tipRef.current) return;
    const el = tipRef.current;
    el.style.marginLeft = '0px';
    const r = el.getBoundingClientRect();
    const m = 8,
      vw = document.documentElement.clientWidth;
    setShift(r.left < m ? m - r.left : r.right > vw - m ? vw - m - r.right : 0);
  }, [showTip, unavailableReason]);
  const control = /*#__PURE__*/React.createElement("label", {
    onMouseEnter: unavailable ? () => setTip(t => ({
      ...t,
      hover: true
    })) : undefined,
    onMouseLeave: unavailable ? () => setTip(t => ({
      ...t,
      hover: false,
      esc: false
    })) : undefined,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      cursor: disabled || unavailable ? 'not-allowed' : 'pointer',
      opacity: disabled || unavailable ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 20,
      height: 20,
      flex: '0 0 auto',
      boxSizing: 'border-box',
      borderRadius: '50%',
      border: `2px solid ${checked ? 'var(--color-brand)' : 'var(--border-strong)'}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-action)',
      outline: focus ? '2px solid var(--color-brand-dark)' : 'none',
      outlineOffset: 2
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    role: "radio",
    name: name,
    checked: checked,
    disabled: disabled,
    "aria-disabled": unavailable || undefined,
    "aria-describedby": unavailable ? tipId : rest['aria-describedby'],
    onChange: e => {
      if (unavailable) return;
      onChange && onChange(true);
    },
    onClick: e => {
      if (unavailable) e.preventDefault();
    },
    onFocus: e => {
      fv(e);
      if (unavailable) setTip(t => ({
        ...t,
        focus: true,
        esc: false
      }));
    },
    onBlur: () => {
      setFocus(false);
      if (unavailable) setTip(t => ({
        ...t,
        focus: false
      }));
    },
    onKeyDown: e => {
      if (unavailable && e.key === 'Escape') setTip(t => ({
        ...t,
        esc: true
      }));
    },
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      margin: 0,
      opacity: 0,
      cursor: 'inherit',
      zIndex: 1
    }
  }, rest)), checked && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--color-brand)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)'
    }
  }, label));
  if (!unavailableReason) return control;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, control, /*#__PURE__*/React.createElement("span", {
    ref: tipRef,
    id: tipId,
    role: "tooltip",
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      marginLeft: shift,
      textAlign: 'center',
      visibility: showTip ? 'visible' : 'hidden',
      pointerEvents: 'none',
      zIndex: 10,
      background: 'var(--neutral-900, #011e41)',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      lineHeight: 1.3,
      padding: '6px 10px',
      borderRadius: 'var(--radius-xs)',
      maxWidth: 260,
      width: 'max-content'
    }
  }, unavailableReason));
}
Object.assign(__ds_scope, { Radio, __ds_default_components_forms_Radio_jyiy9r: Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Switch — pill toggle; cyan track + sliding white knob when on. Control nativo (input checkbox) oculto sobre el visual: operable con teclado, foco visible, rol/estado anunciados. unavailableReason: enfocable, no cambia, aria-disabled, tooltip con el motivo al foco/hover (Esc oculta). Regla: si no aplica y tiene motivo, no usar disabled (ver Button.unavailableReason). */
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  unavailableReason,
  style = {},
  ...rest
}) {
  const unavailable = !!unavailableReason && !disabled;
  const [tip, setTip] = React.useState({
    hover: false,
    focus: false,
    esc: false
  });
  const tipId = React.useId();
  const tipRef = React.useRef(null);
  const [shift, setShift] = React.useState(0);
  const showTip = unavailable && !tip.esc && (tip.hover || tip.focus);
  const [focus, setFocus] = React.useState(false);
  const fv = e => setFocus(e.target.matches(':focus-visible'));
  React.useLayoutEffect(() => {
    if (!showTip || !tipRef.current) return;
    const el = tipRef.current;
    el.style.marginLeft = '0px';
    const r = el.getBoundingClientRect();
    const m = 8,
      vw = document.documentElement.clientWidth;
    setShift(r.left < m ? m - r.left : r.right > vw - m ? vw - m - r.right : 0);
  }, [showTip, unavailableReason]);
  const control = /*#__PURE__*/React.createElement("label", {
    onMouseEnter: unavailable ? () => setTip(t => ({
      ...t,
      hover: true
    })) : undefined,
    onMouseLeave: unavailable ? () => setTip(t => ({
      ...t,
      hover: false,
      esc: false
    })) : undefined,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled || unavailable ? 'not-allowed' : 'pointer',
      opacity: disabled || unavailable ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 44,
      height: 24,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--color-brand)' : 'var(--neutral-300)',
      transition: 'var(--transition-action)',
      outline: focus ? '2px solid var(--color-brand-dark)' : 'none',
      outlineOffset: 2
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    "aria-disabled": unavailable || undefined,
    "aria-describedby": unavailable ? tipId : rest['aria-describedby'],
    onChange: e => {
      if (unavailable) return;
      onChange && onChange(e.target.checked);
    },
    onClick: e => {
      if (unavailable) e.preventDefault();
    },
    onFocus: e => {
      fv(e);
      if (unavailable) setTip(t => ({
        ...t,
        focus: true,
        esc: false
      }));
    },
    onBlur: () => {
      setFocus(false);
      if (unavailable) setTip(t => ({
        ...t,
        focus: false
      }));
    },
    onKeyDown: e => {
      if (unavailable && e.key === 'Escape') setTip(t => ({
        ...t,
        esc: true
      }));
    },
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      margin: 0,
      opacity: 0,
      cursor: 'inherit',
      zIndex: 1
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 22 : 2,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 3px rgba(1,30,65,0.3)',
      transition: 'var(--transition-action)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)'
    }
  }, label));
  if (!unavailableReason) return control;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, control, /*#__PURE__*/React.createElement("span", {
    ref: tipRef,
    id: tipId,
    role: "tooltip",
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      marginLeft: shift,
      textAlign: 'center',
      visibility: showTip ? 'visible' : 'hidden',
      pointerEvents: 'none',
      zIndex: 10,
      background: 'var(--neutral-900, #011e41)',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      lineHeight: 1.3,
      padding: '6px 10px',
      borderRadius: 'var(--radius-xs)',
      maxWidth: 260,
      width: 'max-content'
    }
  }, unavailableReason));
}
Object.assign(__ds_scope, { Switch, __ds_default_components_forms_Switch_kgb19e: Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SideNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SideNav — left module menu with two views.
 * Collapsed: icon rail (icon + 2-line label), isotipo on top.
 * Expanded: horizontal logo, module rows with caret, accordion of sub-menus.
 * Clicking the round toggle OR a module icon in the rail expands it; clicking a module
 * (rail or expanded) opens its internal menu.
 */
function SideNav({
  items = [],
  activeId,
  activeChildId,
  collapsed,
  defaultCollapsed = true,
  onCollapsedChange,
  onNavigate,
  logoCollapsed,
  logoExpanded,
  logoAlt = 'Aseguradora del Sur',
  ariaLabel = 'Menú principal',
  height = '100%',
  className = '',
  style = {},
  ...rest
}) {
  const [innerCollapsed, setInnerCollapsed] = React.useState(defaultCollapsed);
  const isCollapsed = collapsed ?? innerCollapsed;
  const [openId, setOpenId] = React.useState(activeId ?? null);
  const uid = React.useId ? React.useId() : 'sn';
  function setCollapsed(next) {
    if (collapsed === undefined) setInnerCollapsed(next);
    onCollapsedChange && onCollapsedChange(next);
  }
  function onModule(item) {
    const hasChildren = item.children && item.children.length;
    if (isCollapsed) {
      setCollapsed(false);
      setOpenId(item.id);
      if (!hasChildren) onNavigate && onNavigate(item.id, null);
      return;
    }
    if (hasChildren) setOpenId(openId === item.id ? null : item.id);else onNavigate && onNavigate(item.id, null);
  }
  const renderIcon = (icon, size) => typeof icon === 'string' ? /*#__PURE__*/React.createElement(__ds_scope.FeedbackIcon, {
    name: icon,
    size: size
  }) : icon;
  const caret = (down, color) => /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 0,
      height: 0,
      flex: '0 0 auto',
      borderStyle: 'solid',
      borderWidth: down ? '5px 4px 0 4px' : '4px 0 4px 5px',
      borderColor: down ? `${color} transparent transparent transparent` : `transparent transparent transparent ${color}`
    }
  });
  return /*#__PURE__*/React.createElement("nav", _extends({
    "aria-label": ariaLabel,
    className: `ads-sidenav ads-sidenav--${isCollapsed ? 'collapsed' : 'expanded'} ${className}`.trim(),
    style: {
      position: 'relative',
      zIndex: 'var(--z-sidenav)',
      flex: '0 0 auto',
      width: isCollapsed ? 'var(--sidenav-width-collapsed)' : 'var(--sidenav-width-expanded)',
      height,
      background: 'var(--sidenav-bg)',
      borderRight: '1px solid var(--sidenav-border)',
      boxShadow: isCollapsed ? 'none' : 'var(--shadow-soft)',
      transition: 'width var(--dur-action) var(--ease-standard), box-shadow var(--dur-action) var(--ease-standard)',
      fontFamily: 'var(--font-brand)',
      boxSizing: 'border-box',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setCollapsed(!isCollapsed),
    "aria-expanded": !isCollapsed,
    "aria-label": isCollapsed ? 'Expandir menú' : 'Contraer menú',
    className: "ads-sidenav__toggle",
    style: {
      position: 'absolute',
      top: 56,
      right: 'calc(var(--sidenav-toggle-size) / -2)',
      zIndex: 2,
      width: 'var(--sidenav-toggle-size)',
      height: 'var(--sidenav-toggle-size)',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--border-subtle)',
      background: 'var(--white)',
      boxShadow: 'var(--shadow-sm)',
      color: 'var(--neutral-500)',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-action)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = 'var(--color-secondary)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = 'var(--neutral-500)';
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FeedbackIcon, {
    name: isCollapsed ? 'chevronRight' : 'chevronLeft',
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "ads-sidenav__scroll",
    style: {
      height: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 130,
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isCollapsed ? '0 16px' : '0 28px',
      boxSizing: 'border-box'
    }
  }, isCollapsed ? logoCollapsed ? /*#__PURE__*/React.createElement("img", {
    src: logoCollapsed,
    alt: logoAlt,
    style: {
      height: 56,
      maxWidth: '100%'
    }
  }) : null : logoExpanded ? /*#__PURE__*/React.createElement("img", {
    src: logoExpanded,
    alt: logoAlt,
    style: {
      width: '100%',
      maxHeight: 84,
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)'
    }
  }, logoAlt)), /*#__PURE__*/React.createElement("ul", {
    role: "list",
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, items.map(item => {
    const active = item.id === activeId;
    const hasChildren = !!(item.children && item.children.length);
    const open = !isCollapsed && hasChildren && openId === item.id;
    const subId = `${uid}-sub-${item.id}`;
    const fg = active ? 'var(--sidenav-active-fg)' : 'var(--sidenav-fg)';
    return /*#__PURE__*/React.createElement("li", {
      key: item.id
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onModule(item),
      "aria-expanded": hasChildren ? open : undefined,
      "aria-controls": hasChildren && !isCollapsed ? subId : undefined,
      "aria-current": active && !hasChildren ? 'page' : undefined,
      title: isCollapsed ? item.label : undefined,
      className: `ads-sidenav__item${active ? ' ads-sidenav__item--active' : ''}`,
      style: isCollapsed ? {
        width: '100%',
        minHeight: 92,
        padding: '18px 8px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: active ? 'var(--sidenav-active-bg)' : 'transparent',
        color: fg,
        transition: 'var(--transition-action)',
        boxSizing: 'border-box'
      } : {
        width: '100%',
        height: active ? 64 : 64,
        padding: '0 24px 0 18px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textAlign: 'left',
        background: active ? 'var(--sidenav-active-bg)' : 'transparent',
        color: fg,
        transition: 'var(--transition-action)',
        boxSizing: 'border-box'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = 'var(--sidenav-hover-bg)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        color: 'inherit',
        opacity: active ? 1 : 0.85
      }
    }, renderIcon(item.icon, 22)), isCollapsed ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 'var(--fw-bold)',
        lineHeight: 1.6,
        letterSpacing: '0.02em',
        textAlign: 'center',
        color: 'inherit'
      }
    }, item.label) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: active ? 17 : 16,
        fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-semibold)',
        letterSpacing: '0.01em',
        color: 'inherit',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, item.label), hasChildren && caret(open, active ? 'var(--white)' : 'var(--neutral-600)'))), open && /*#__PURE__*/React.createElement("ul", {
      id: subId,
      role: "list",
      style: {
        listStyle: 'none',
        margin: 0,
        padding: 0
      }
    }, item.children.map(child => {
      const childActive = active && child.id === activeChildId;
      return /*#__PURE__*/React.createElement("li", {
        key: child.id
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => onNavigate && onNavigate(item.id, child.id),
        "aria-current": childActive ? 'page' : undefined,
        className: `ads-sidenav__subitem${childActive ? ' ads-sidenav__subitem--active' : ''}`,
        style: {
          width: '100%',
          height: 32,
          padding: '0 18px',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          background: childActive ? 'var(--sidenav-sub-active-bg)' : 'transparent',
          color: 'var(--sidenav-sub-fg)',
          fontFamily: 'var(--font-brand)',
          fontSize: 14,
          fontWeight: childActive ? 'var(--fw-semibold)' : 'var(--fw-medium)',
          letterSpacing: '0.04em',
          transition: 'var(--transition-action)',
          boxSizing: 'border-box'
        },
        onMouseEnter: e => {
          if (!childActive) e.currentTarget.style.background = 'var(--sidenav-hover-bg)';
        },
        onMouseLeave: e => {
          if (!childActive) e.currentTarget.style.background = 'transparent';
        }
      }, child.label));
    })));
  }))));
}
Object.assign(__ds_scope, { SideNav, __ds_default_components_navigation_SideNav_5hyfkz: SideNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SideNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Tabs — horizontal nav with a cyan active underline. */
function Tabs({
  tabs = [],
  active = 0,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      borderBottom: '1px solid var(--border-default)',
      ...style
    }
  }, tabs.map((t, i) => {
    const on = i === active;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      onClick: () => onChange && onChange(i),
      style: {
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '0 0 12px',
        marginBottom: -1,
        fontFamily: 'var(--font-brand)',
        fontSize: 'var(--fs-body)',
        fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)',
        color: on ? 'var(--text-strong)' : 'var(--text-muted)',
        borderBottom: `3px solid ${on ? 'var(--color-brand)' : 'transparent'}`,
        transition: 'var(--transition-action)'
      }
    }, t);
  }));
}
Object.assign(__ds_scope, { Tabs, __ds_default_components_navigation_Tabs_14bb2wz: Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/login/LoginScreen.jsx
try { (() => {
// LoginScreen — ADS split login: header w/ horizontal logo, photo left, LoginForm right, royal-blue footer.
function LoginHeader() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 'var(--login-header-height)',
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      padding: '0 60px',
      background: '#fff',
      borderBottom: '2px solid var(--cyan-700)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/ads-horizontal.png",
    alt: "Aseguradora del Sur",
    style: {
      height: 62
    }
  }));
}
function LoginScreen() {
  const {
    LoginForm,
    Modal,
    Input,
    Button,
    Snackbar
  } = window.AseguradoraDelSurDesignSystem_4fbf29;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [recovery, setRecovery] = React.useState(null); // null | email string
  const [recLoading, setRecLoading] = React.useState(false);
  const [snack, setSnack] = React.useState('');
  function signIn({
    email,
    password
  }) {
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (password.length < 6) setError('Correo o contraseña incorrectos');else setSnack(`Bienvenido, ${email.split('@')[0]}`);
    }, 1400);
  }
  function sendRecovery() {
    setRecLoading(true);
    setTimeout(() => {
      setRecLoading(false);
      setRecovery(null);
      setSnack('Te enviamos un enlace para restablecer tu contraseña');
    }, 1200);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LoginHeader, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.4fr) minmax(360px,1fr)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-photo",
    style: {
      position: 'relative',
      minHeight: 480
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "login-photo",
    shape: "rect",
    src: "../../assets/images/login-office.png",
    placeholder: "Foto de oficina / marca"
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px'
    }
  }, LoginForm ? /*#__PURE__*/React.createElement(LoginForm, {
    loading: loading,
    error: error,
    onSubmit: signIn,
    onForgotPassword: email => setRecovery(email || '')
  }) : /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-brand)',
      color: 'var(--text-muted)'
    }
  }, "Cargando componentes\u2026"))), /*#__PURE__*/React.createElement(RenovacionesFooter, null), /*#__PURE__*/React.createElement(Modal, {
    open: recovery !== null,
    onClose: () => setRecovery(null),
    size: "sm",
    title: "Recuperar contrase\xF1a",
    description: "Te enviaremos un enlace a tu correo registrado.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setRecovery(null)
    }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
      loading: recLoading,
      onClick: sendRecovery
    }, "Enviar enlace"))
  }, /*#__PURE__*/React.createElement(Input, {
    variant: "outlined",
    label: "Correo",
    type: "email",
    autoComplete: "username",
    value: recovery || '',
    onChange: e => setRecovery(e.target.value)
  })), /*#__PURE__*/React.createElement(Snackbar, {
    open: !!snack,
    tone: "success",
    message: snack,
    onClose: () => setSnack('')
  }));
}
window.LoginScreen = LoginScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/login/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/login/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/login/image-slot.js", error: String((e && e.message) || e) }); }

// ui_kits/renovaciones/DetallesModal.jsx
try { (() => {
// DetallesModal — read-only account detail sheet
function DetallesModal({
  onClose
}) {
  const rows = [['Nombre contratista', 'Consorcio Tena'], ['Identificación del contratista (CI/RUC)', '159178344001'], ['Teléfono celular', '0979001473'], ['Correo (mail)', 'ejemplo@gmail.com'], ['Nombre asegurado', 'Empudepro'], ['Identificación asegurado', '0910283798'], ['Número de póliza', '1159908'], ['Número de renovación', '5'], ['APS', 'Maldonado Guerra Marina'], ['Tasa', '5%'], ['Forma de pago', 'Contado'], ['Suma asegurada', '$76.542,67'], ['Prima total', '$250.152,14'], ['Endoso', 'Renovación'], ['Sucursal', 'Quito']];
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    style: {
      width: 640
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal-x",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 24,
      height: 24
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 30,
      color: 'var(--text-strong)',
      margin: '0 0 4px'
    }
  }, "Detalles"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontSize: 16,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "Aqu\xED puedes ver los detalles de la cuenta que seleccionaste")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, rows.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontFamily: 'var(--font-brand)',
      fontSize: 16,
      lineHeight: 1.4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, k, ": "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      borderTop: '2px dashed var(--color-secondary)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      appearance: 'none',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'var(--font-brand)',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--color-secondary)'
    }
  }, "M\xE1s"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      borderTop: '2px dashed var(--color-secondary)'
    }
  }))));
}
window.DetallesModal = DetallesModal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/renovaciones/DetallesModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/renovaciones/NuevoPedidoModal.jsx
try { (() => {
// NuevoPedidoModal — multi-field "new order" form in a centered modal
function Field({
  label,
  value,
  placeholder,
  type = 'select',
  error,
  blocked,
  full
}) {
  const active = !!value && !blocked;
  const border = error ? 'var(--color-danger)' : active ? 'var(--color-brand)' : 'var(--border-default)';
  const labelColor = error ? 'var(--color-danger)' : active ? 'var(--color-brand-dark)' : 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      gridColumn: full ? '1 / -1' : 'auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontSize: 12,
      fontWeight: 600,
      color: labelColor,
      paddingLeft: 2
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 52,
      padding: '0 14px',
      border: `1.5px solid ${border}`,
      borderRadius: 'var(--radius-sm)',
      background: blocked ? 'var(--neutral-050)' : '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-brand)',
      fontSize: 16,
      color: value ? 'var(--text-strong)' : 'var(--text-muted)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, value || placeholder), /*#__PURE__*/React.createElement("i", {
    "data-lucide": type === 'date' ? 'calendar' : type === 'select' ? 'chevron-down' : 'user',
    style: {
      width: 18,
      height: 18,
      color: 'var(--text-muted)',
      flex: '0 0 auto'
    }
  })), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontSize: 12,
      color: 'var(--color-danger)',
      paddingLeft: 2
    }
  }, error));
}
function NuevoPedidoModal({
  onClose
}) {
  const {
    Button
  } = window.AseguradoraDelSurDesignSystem_4fbf29;
  const tabs = ['Individual', 'Por planilla', 'Masivo', 'Especial'];
  const [tab, setTab] = React.useState(0);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    style: {
      width: 860
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal-x",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 24,
      height: 24
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 30,
      color: 'var(--text-strong)',
      margin: '0 0 4px'
    }
  }, "Nuevo pedido"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontSize: 16,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "Selecciona el tipo de pedido que deseas ingresar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderBottom: '2px solid var(--border-subtle)',
      marginBottom: 'var(--space-2)'
    }
  }, tabs.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setTab(i),
    style: {
      flex: 1,
      appearance: 'none',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      padding: '0 0 12px',
      marginBottom: -2,
      fontFamily: 'var(--font-brand)',
      fontSize: 16,
      fontWeight: i === tab ? 700 : 500,
      color: i === tab ? 'var(--text-strong)' : 'var(--neutral-400)',
      borderBottom: `2px solid ${i === tab ? 'var(--color-secondary)' : 'transparent'}`
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "star",
    style: {
      width: 18,
      height: 18
    }
  }), t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: 'var(--space-5) 0 var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      borderTop: '2px dashed var(--color-secondary)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--color-secondary)'
    }
  }, "Pedido individual"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      borderTop: '2px dashed var(--color-secondary)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "N\xB0 de p\xF3liza",
    value: "1156790"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Nombre del contratista",
    value: "Consorcio Tena"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Nombre del asegurado",
    value: "Empudepro"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Ramo",
    value: "Cumplimiento de contrato"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Inicio de vigencia",
    value: "01/01/2024",
    type: "date"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Fin de vigencia",
    value: "03/01/2024",
    type: "date"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Suma asegurada",
    value: "$76.542,67",
    type: "text"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Objeto de contrato",
    placeholder: "Objeto de contrato",
    type: "text"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Plazo",
    value: "12 meses"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-5)',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Tipo de pedido",
    value: "Renovaci\xF3n - Planilla"
  }), /*#__PURE__*/React.createElement("button", {
    className: "dropzone"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "image",
    style: {
      width: 22,
      height: 22
    }
  }), /*#__PURE__*/React.createElement("span", null, "Cargar pedido"))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    placeholder: "Observaciones",
    defaultValue: "Campo completo",
    style: {
      width: '100%',
      minHeight: 96,
      resize: 'vertical',
      boxSizing: 'border-box',
      padding: 14,
      border: '1.5px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-brand)',
      fontSize: 16,
      color: 'var(--text-strong)',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    style: {
      marginTop: 'var(--space-6)'
    },
    iconLeft: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "cloud-upload",
      style: {
        width: 20,
        height: 20
      }
    })
  }, "Ingresar pedido")));
}
window.NuevoPedidoModal = NuevoPedidoModal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/renovaciones/NuevoPedidoModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/renovaciones/RenovacionesFooter.jsx
try { (() => {
// RenovacionesFooter — royal-blue module footer with socials + copyright
function RenovacionesFooter() {
  const socials = [['Facebook', 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z'], ['TikTok', 'M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1 0-5.18c.27 0 .52.04.77.12v-3.2a5.7 5.7 0 0 0-.77-.05A5.78 5.78 0 0 0 9.95 21a5.78 5.78 0 0 0 5.6-5.78V9.01a7.5 7.5 0 0 0 4.37 1.4V7.3a4.28 4.28 0 0 1-3.32-1.48z'], ['WhatsApp', 'M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.26A10 10 0 1 0 12 2z']];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--color-secondary)',
      height: 56,
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)'
    }
  }, socials.map(([label, d], i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    "aria-label": label,
    style: {
      color: 'rgba(255,255,255,0.85)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: d
  }))))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontSize: 14,
      color: '#fff'
    }
  }, "\xA92026 Aseguradora del Sur"));
}
window.RenovacionesFooter = RenovacionesFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/renovaciones/RenovacionesFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/renovaciones/RenovacionesTable.jsx
try { (() => {
// RenovacionesTable — sortable data table of bond renewals + pagination
const ROWS = Array.from({
  length: 10
}).map((_, i) => ({
  sucursal: ['Ambato', 'Quito', 'Guayaquil', 'Cuenca'][i % 4],
  aseguradora: 'Cifraseg S.A',
  ramo: 'Cumplimiento de contrato',
  poliza: 1046728 + i * 13,
  nren: i % 5 + 1,
  inicio: '12/09/2024',
  fin: '12/09/2025',
  asegurado: ['Consorcio Central', 'Empudepro', 'Consorcio Tena', 'Hidroeléctrica Sur'][i % 4],
  monto: ['36.000,00', '76.542,67', '12.300,00', '250.152,14'][i % 4],
  contratista: ['Secretaría Oleoducto', 'Municipio de Ambato', 'Petroecuador EP', 'Consorcio Vial'][i % 4]
}));
const COLS = [{
  key: 'sucursal',
  label: 'Sucursal'
}, {
  key: 'aseguradora',
  label: 'Aseguradora'
}, {
  key: 'ramo',
  label: 'Ramo'
}, {
  key: 'poliza',
  label: 'Póliza'
}, {
  key: 'nren',
  label: 'N°'
}, {
  key: 'inicio',
  label: 'Inicio vigencia'
}, {
  key: 'fin',
  label: 'Fin vigencia'
}, {
  key: 'asegurado',
  label: 'Asegurado'
}, {
  key: 'monto',
  label: 'Monto'
}, {
  key: 'contratista',
  label: 'Contratista'
}];
function RowActions({
  onDetails
}) {
  const acts = [{
    icon: 'eye',
    title: 'Ver detalles',
    fn: onDetails
  }, {
    icon: 'sparkles',
    title: 'Analizar pedido',
    fn: null
  }, {
    icon: 'paperclip',
    title: 'Adjuntar',
    fn: null
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, acts.map((a, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    title: a.title,
    onClick: a.fn,
    className: "row-act"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": a.icon,
    style: {
      width: 19,
      height: 19
    }
  }))));
}
function RenovacionesTable({
  onDetails
}) {
  const [page, setPage] = React.useState(1);
  const pages = [1, 2, 3, 4, '…', 8];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-brand)',
      minWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--table-row-hover)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      ...thStyle,
      paddingLeft: 24
    }
  }, "Firma"), COLS.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: thStyle
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, c.label, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-down",
    style: {
      width: 14,
      height: 14,
      color: 'var(--neutral-400)'
    }
  })))))), /*#__PURE__*/React.createElement("tbody", null, ROWS.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: "ren-row"
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...tdStyle,
      paddingLeft: 24
    }
  }, /*#__PURE__*/React.createElement(RowActions, {
    onDetails: onDetails
  })), COLS.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      ...tdStyle,
      color: c.key === 'asegurado' || c.key === 'poliza' ? 'var(--text-strong)' : 'var(--text-body)',
      fontWeight: c.key === 'asegurado' ? 600 : 400
    }
  }, r[c.key]))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, "Resultados 1-10 de 84"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "pg-arrow",
    onClick: () => setPage(p => Math.max(1, p - 1))
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-left",
    style: {
      width: 18,
      height: 18
    }
  })), pages.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    disabled: p === '…',
    onClick: () => typeof p === 'number' && setPage(p),
    style: {
      minWidth: 34,
      height: 34,
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      cursor: p === '…' ? 'default' : 'pointer',
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 14,
      background: p === page ? 'var(--color-brand)' : 'transparent',
      color: p === page ? '#fff' : 'var(--text-body)'
    }
  }, p)), /*#__PURE__*/React.createElement("button", {
    className: "pg-arrow",
    onClick: () => setPage(p => p + 1)
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-right",
    style: {
      width: 18,
      height: 18
    }
  })))));
}
const thStyle = {
  textAlign: 'left',
  padding: '16px 18px',
  fontFamily: 'var(--font-brand)',
  fontWeight: 700,
  fontSize: 14,
  color: 'var(--text-strong)',
  whiteSpace: 'nowrap'
};
const tdStyle = {
  padding: '16px 18px',
  fontFamily: 'var(--font-brand)',
  fontSize: 14,
  borderTop: '1px solid var(--border-subtle)',
  whiteSpace: 'nowrap'
};
window.RenovacionesTable = RenovacionesTable;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/renovaciones/RenovacionesTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/renovaciones/TopBar.jsx
try { (() => {
// TopBar — module top menu: ADS isotipo, Admin tag, user dropdown
function TopBar({
  showLogo = true
}) {
  const {
    Avatar
  } = window.AseguradoraDelSurDesignSystem_4fbf29;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 80,
      background: '#fff',
      borderBottom: '2px solid var(--cyan-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 48px',
      boxSizing: 'border-box',
      flex: '0 0 auto'
    }
  }, showLogo ? /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/ads-isotipo.svg",
    alt: "Aseguradora del Sur",
    style: {
      height: 46
    }
  }) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--admin-green)',
      color: '#fff',
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 13,
      padding: '4px 14px',
      borderRadius: 'var(--radius-pill)'
    }
  }, "Admin"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      padding: '6px 12px 6px 6px',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "V\xEDctor Salazar",
    size: 36
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--text-strong)'
    }
  }, "V\xEDctor"), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-down",
    style: {
      width: 18,
      height: 18,
      color: 'var(--text-muted)'
    }
  }))));
}
window.TopBar = TopBar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/renovaciones/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/siniestros/ClaimsPortal.jsx
try { (() => {
// ClaimsPortal — siniestros tracking board with horizontal stepper & detail
function Stepper({
  steps,
  current
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start'
    }
  }, steps.map((s, i) => {
    const done = i < current,
      active = i === current;
    const color = done ? 'var(--color-success)' : active ? 'var(--color-brand)' : 'var(--neutral-300)';
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        flex: '0 0 auto',
        width: 96
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: done || active ? color : '#fff',
        border: `2px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: done || active ? '#fff' : 'var(--neutral-400)',
        flex: '0 0 auto'
      }
    }, done ? /*#__PURE__*/React.createElement("i", {
      "data-lucide": "check",
      style: {
        width: 18,
        height: 18
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-brand)',
        fontWeight: 700,
        fontSize: 14
      }
    }, i + 1)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-brand)',
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--text-strong)' : 'var(--text-muted)',
        textAlign: 'center',
        lineHeight: 1.3
      }
    }, s)), i < steps.length - 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        height: 2,
        background: i < current ? 'var(--color-success)' : 'var(--neutral-300)',
        flex: 1,
        marginTop: 17
      }
    }));
  }));
}
function ClaimsPortal() {
  const {
    Card,
    Badge,
    Button,
    Tabs
  } = window.AseguradoraDelSurDesignSystem_4fbf29;
  const STEPS = ['Reportado', 'En evaluación', 'Aprobado', 'Indemnizado'];
  const claims = [{
    id: 'SIN-2026-0412',
    type: 'Vehicular',
    icon: 'car',
    desc: 'Choque lateral · Av. República',
    date: '28 may 2026',
    step: 1,
    amount: '$2.400',
    tone: 'warning',
    status: 'En evaluación',
    tl: [['Siniestro reportado', '28 may · 09:14'], ['Documentos recibidos', '28 may · 11:02'], ['Asignado a perito', '29 may · 08:30']]
  }, {
    id: 'SIN-2026-0389',
    type: 'Hogar',
    icon: 'home',
    desc: 'Daño por agua · Cocina',
    date: '14 may 2026',
    step: 3,
    amount: '$1.150',
    tone: 'success',
    status: 'Indemnizado',
    tl: [['Siniestro reportado', '14 may'], ['Evaluación completada', '16 may'], ['Aprobado', '18 may'], ['Pago realizado', '20 may']]
  }, {
    id: 'SIN-2026-0361',
    type: 'Salud',
    icon: 'stethoscope',
    desc: 'Reembolso consulta médica',
    date: '02 may 2026',
    step: 2,
    amount: '$320',
    tone: 'brand',
    status: 'Aprobado',
    tl: [['Solicitud recibida', '02 may'], ['En evaluación', '03 may'], ['Aprobado', '05 may']]
  }];
  const [sel, setSel] = React.useState(0);
  const [tab, setTab] = React.useState(1);
  const c = claims[sel];
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto',
      padding: 'var(--space-8) var(--space-6) var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 300,
      fontSize: 36,
      color: 'var(--text-strong)',
      margin: '0 0 4px'
    }
  }, "Siniestros"), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0
    }
  }, "Realiza el seguimiento de tus siniestros.")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "plus",
      style: {
        width: 18,
        height: 18
      }
    })
  }, "Reportar siniestro")), /*#__PURE__*/React.createElement(Tabs, {
    tabs: ['Mis pólizas', 'Siniestros', 'Pagos', 'Documentos'],
    active: tab,
    onChange: setTab,
    style: {
      marginBottom: 'var(--space-8)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '380px 1fr',
      gap: 'var(--space-6)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, claims.map((cl, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: () => setSel(i),
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      cursor: 'pointer',
      border: `1.5px solid ${i === sel ? 'var(--color-brand)' : 'var(--border-subtle)'}`,
      boxShadow: i === sel ? 'var(--shadow-sm)' : 'none',
      transition: 'var(--transition-action)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--cyan-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": cl.icon,
    style: {
      width: 22,
      height: 22,
      color: 'var(--color-brand-dark)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--text-strong)'
    }
  }, cl.type), /*#__PURE__*/React.createElement(Badge, {
    tone: cl.tone
  }, cl.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, cl.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, cl.id, " \xB7 ", cl.date)))))), /*#__PURE__*/React.createElement(Card, {
    elevation: "md",
    style: {
      padding: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 22,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Seguro ", c.type), /*#__PURE__*/React.createElement(Badge, {
    tone: c.tone
  }, c.status)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, c.id, " \xB7 Reportado el ", c.date)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Monto estimado"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 800,
      fontSize: 26,
      color: 'var(--text-strong)'
    }
  }, c.amount))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6) 0',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Stepper, {
    steps: STEPS,
    current: c.step
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: '.03em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      margin: '0 0 var(--space-4)'
    }
  }, "L\xEDnea de tiempo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, c.tl.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--color-brand)',
      marginTop: 4
    }
  }), i < c.tl.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      flex: 1,
      background: 'var(--border-default)'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-strong)'
    }
  }, t[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, t[1])))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: '.03em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      margin: '0 0 var(--space-4)'
    }
  }, "Resumen"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, [['Póliza', 'POL-884-2231'], ['Tipo de evento', c.desc], ['Perito asignado', 'C. Mendoza'], ['Deducible', '$250']].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      paddingBottom: 'var(--space-3)',
      borderBottom: '1px dashed var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, r[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 600,
      fontSize: 13,
      color: 'var(--text-strong)',
      textAlign: 'right'
    }
  }, r[1])))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "paperclip",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Adjuntar"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "message-circle",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Contactar asesor")))))));
}
window.ClaimsPortal = ClaimsPortal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/siniestros/ClaimsPortal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/siniestros/PortalHeader.jsx
try { (() => {
// PortalHeader — compact authenticated header for the Sur One web portal
function PortalHeader() {
  const {
    Avatar
  } = window.AseguradoraDelSurDesignSystem_4fbf29;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: '#fff',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto',
      height: 68,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)',
      padding: '0 var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/ads-horizontal.png",
    alt: "Aseguradora del Sur",
    style: {
      height: 30
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "search",
    style: {
      width: 20,
      height: 20
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "bell",
    style: {
      width: 20,
      height: 20
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      right: 2,
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--color-danger)',
      border: '2px solid #fff'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Ana\xEDs Romero",
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--text-strong)'
    }
  }, "Ana\xEDs Romero"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Cliente \xB7 Quito")), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-down",
    style: {
      width: 16,
      height: 16,
      color: 'var(--text-muted)'
    }
  })))));
}
window.PortalHeader = PortalHeader;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/siniestros/PortalHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/FeaturesSection.jsx
try { (() => {
// FeaturesSection — "Contrata con nosotros" value props on teal band
function FeaturesSection() {
  const feats = [{
    icon: 'headset',
    title: 'Soporte 24/7',
    desc: 'Asistencia inmediata todos los días del año.'
  }, {
    icon: 'sparkles',
    title: 'Servicio personalizado',
    desc: 'Un asesor que entiende lo que necesitas.'
  }, {
    icon: 'flag',
    title: 'Empresa 100% ecuatoriana',
    desc: 'Comprometidos con el país y su gente.'
  }, {
    icon: 'users',
    title: 'El mejor talento humano',
    desc: 'Profesionales que cuidan de ti.'
  }, {
    icon: 'heart-handshake',
    title: 'El cliente va primero',
    desc: 'Cada decisión piensa en ti.'
  }, {
    icon: 'rocket',
    title: 'Innovamos permanentemente',
    desc: 'Tecnología al servicio de tu tranquilidad.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-teal)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-24) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "t-eyebrow"
  }, "Contrata con nosotros"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 300,
      fontSize: 40,
      color: 'var(--text-strong)',
      margin: 'var(--space-2) 0 var(--space-10)'
    }
  }, "La mejor opci\xF3n para ti"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-10) var(--space-12)'
    }
  }, feats.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--color-brand)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-button)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": f.icon,
    style: {
      width: 24,
      height: 24,
      color: '#fff'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--text-strong)',
      margin: '4px 0 6px'
    }
  }, f.title), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0,
      fontSize: 15
    }
  }, f.desc)))))));
}
window.FeaturesSection = FeaturesSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/FeaturesSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// AppPromo + Footer — Sur One promo strip (purple) over the navy footer
function Footer() {
  const {
    Button,
    Input
  } = window.AseguradoraDelSurDesignSystem_4fbf29;
  const cols = [{
    h: 'Soluciones',
    items: ['Vehicular', 'Vida', 'Salud', 'Hogar', 'Empresas']
  }, {
    h: 'Nosotros',
    items: ['Quiénes somos', 'Trabaja con nosotros', 'Sostenibilidad', 'Noticias']
  }, {
    h: 'Soporte',
    items: ['Centro de ayuda', 'Siniestros', 'Oficinas', 'Contáctanos']
  }];
  return /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surone-purple)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-10) var(--space-8)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/sur-one-icon.png",
    alt: "Sur One",
    style: {
      width: 64,
      height: 64,
      borderRadius: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-surone)',
      fontWeight: 800,
      fontSize: 24,
      color: '#fff',
      margin: '0 0 4px'
    }
  }, "Descarga Sur One"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-surone)',
      fontSize: 15,
      color: 'rgba(255,255,255,0.85)',
      margin: 0
    }
  }, "Tus seguros, siniestros y pagos en un solo lugar.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "store-btn"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "smartphone",
    style: {
      width: 18,
      height: 18
    }
  }), " App Store"), /*#__PURE__*/React.createElement("button", {
    className: "store-btn"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "download",
    style: {
      width: 18,
      height: 18
    }
  }), " Google Play")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-navy)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-16) var(--space-8) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 'var(--space-10)',
      paddingBottom: 'var(--space-12)',
      borderBottom: '1px solid rgba(255,255,255,0.12)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/ads-isotipo.svg",
    alt: "",
    style: {
      height: 44,
      marginBottom: 'var(--space-4)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'rgba(255,255,255,0.7)',
      maxWidth: 280,
      lineHeight: 1.5,
      margin: '0 0 var(--space-5)'
    }
  }, "Suscr\xEDbete y recibe noticias y novedades de Aseguradora del Sur."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-end',
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Correo electr\xF3nico",
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "md"
  }, "Recibir"))), cols.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      color: '#fff',
      margin: '0 0 var(--space-4)'
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, c.items.map((it, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'rgba(255,255,255,0.7)',
      textDecoration: 'none'
    }
  }, it))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'rgba(255,255,255,0.55)'
    }
  }, "\xA9 2026 Aseguradora del Sur C.A. Todos los derechos reservados."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, [['Facebook', 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z'], ['Instagram', 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 6.85a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3zm0 8.49a3.34 3.34 0 1 1 0-6.68 3.34 3.34 0 0 1 0 6.68zm6.54-8.69a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z'], ['LinkedIn', 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V10.4H5.67v7.94h2.67zM7 9.24a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.1v-4.36c0-2.33-1.24-3.41-2.9-3.41-1.34 0-1.94.74-2.28 1.26v-1.08h-2.66c.04.75 0 7.94 0 7.94h2.66v-4.43c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.25h2.68z'], ['YouTube', 'M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.42-4.81zM10 15V9l5.2 3-5.2 3z']].map(([label, d], i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    "aria-label": label,
    style: {
      color: 'rgba(255,255,255,0.7)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: d
  })))))))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.standalone.jsx
try { (() => {
// AppPromo + Footer — Sur One promo strip (purple) over the navy footer
function Footer() {
  const {
    Button,
    Input
  } = window.AseguradoraDelSurDesignSystem_4fbf29;
  const cols = [{
    h: 'Soluciones',
    items: ['Vehicular', 'Vida', 'Salud', 'Hogar', 'Empresas']
  }, {
    h: 'Nosotros',
    items: ['Quiénes somos', 'Trabaja con nosotros', 'Sostenibilidad', 'Noticias']
  }, {
    h: 'Soporte',
    items: ['Centro de ayuda', 'Siniestros', 'Oficinas', 'Contáctanos']
  }];
  return /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surone-purple)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-10) var(--space-8)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources.surOneIcon,
    alt: "Sur One",
    style: {
      width: 64,
      height: 64,
      borderRadius: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-surone)',
      fontWeight: 800,
      fontSize: 24,
      color: '#fff',
      margin: '0 0 4px'
    }
  }, "Descarga Sur One"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-surone)',
      fontSize: 15,
      color: 'rgba(255,255,255,0.85)',
      margin: 0
    }
  }, "Tus seguros, siniestros y pagos en un solo lugar.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "store-btn"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "smartphone",
    style: {
      width: 18,
      height: 18
    }
  }), " App Store"), /*#__PURE__*/React.createElement("button", {
    className: "store-btn"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "download",
    style: {
      width: 18,
      height: 18
    }
  }), " Google Play")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-navy)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-16) var(--space-8) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 'var(--space-10)',
      paddingBottom: 'var(--space-12)',
      borderBottom: '1px solid rgba(255,255,255,0.12)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: window.__resources.isotipo,
    alt: "",
    style: {
      height: 44,
      marginBottom: 'var(--space-4)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'rgba(255,255,255,0.7)',
      maxWidth: 280,
      lineHeight: 1.5,
      margin: '0 0 var(--space-5)'
    }
  }, "Suscr\xEDbete y recibe noticias y novedades de Aseguradora del Sur."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-end',
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Correo electr\xF3nico",
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "md"
  }, "Recibir"))), cols.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      color: '#fff',
      margin: '0 0 var(--space-4)'
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, c.items.map((it, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'rgba(255,255,255,0.7)',
      textDecoration: 'none'
    }
  }, it))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'rgba(255,255,255,0.55)'
    }
  }, "\xA9 2026 Aseguradora del Sur C.A. Todos los derechos reservados."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, [['Facebook', 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z'], ['Instagram', 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 6.85a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3zm0 8.49a3.34 3.34 0 1 1 0-6.68 3.34 3.34 0 0 1 0 6.68zm6.54-8.69a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z'], ['LinkedIn', 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V10.4H5.67v7.94h2.67zM7 9.24a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.1v-4.36c0-2.33-1.24-3.41-2.9-3.41-1.34 0-1.94.74-2.28 1.26v-1.08h-2.66c.04.75 0 7.94 0 7.94h2.66v-4.43c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.25h2.68z'], ['YouTube', 'M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.42-4.81zM10 15V9l5.2 3-5.2 3z']].map(([label, d], i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    "aria-label": label,
    style: {
      color: 'rgba(255,255,255,0.7)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: d
  })))))))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.standalone.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
// Header — top navigation bar for the ADS marketing site
function Header() {
  const links = ['Cultura de seg.', 'Soluciones', 'Empresas', 'Sé un agente', 'Nosotros'];
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: '#fff',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: '0 1px 0 rgba(1,30,65,0.04)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      height: 76,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      padding: '0 var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/ads-horizontal.png",
    alt: "Aseguradora del Sur",
    style: {
      height: 34
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      marginLeft: 'var(--space-4)'
    }
  }, links.map((l, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    onMouseEnter: () => setOpen(i),
    style: {
      fontFamily: 'var(--font-brand)',
      fontSize: 15,
      fontWeight: 500,
      color: open === i ? 'var(--text-strong)' : 'var(--text-body)',
      textDecoration: 'none',
      position: 'relative',
      paddingBottom: 4,
      borderBottom: `2px solid ${open === i ? 'var(--color-brand)' : 'transparent'}`,
      transition: 'var(--transition-action)'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-brand)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--color-brand-dark)',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "smartphone",
    style: {
      width: 16,
      height: 16
    }
  }), " App Sur One"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "user",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Ingresar"))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.standalone.jsx
try { (() => {
// Header — top navigation bar for the ADS marketing site
function Header() {
  const links = ['Cultura de seg.', 'Soluciones', 'Empresas', 'Sé un agente', 'Nosotros'];
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: '#fff',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: '0 1px 0 rgba(1,30,65,0.04)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      height: 76,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      padding: '0 var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources.logoH,
    alt: "Aseguradora del Sur",
    style: {
      height: 34
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      marginLeft: 'var(--space-4)'
    }
  }, links.map((l, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    onMouseEnter: () => setOpen(i),
    style: {
      fontFamily: 'var(--font-brand)',
      fontSize: 15,
      fontWeight: 500,
      color: open === i ? 'var(--text-strong)' : 'var(--text-body)',
      textDecoration: 'none',
      position: 'relative',
      paddingBottom: 4,
      borderBottom: `2px solid ${open === i ? 'var(--color-brand)' : 'transparent'}`,
      transition: 'var(--transition-action)'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-brand)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--color-brand-dark)',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "smartphone",
    style: {
      width: 16,
      height: 16
    }
  }), " App Sur One"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "user",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Ingresar"))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.standalone.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
// Hero — cyan banner with the app-in-hand photograph
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--space-8)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      minHeight: 460
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-16) 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.22)',
      color: '#fff',
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      padding: '6px 14px',
      borderRadius: 'var(--radius-pill)',
      marginBottom: 'var(--space-5)'
    }
  }, "+30 a\xF1os protegi\xE9ndote"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 300,
      fontSize: 52,
      lineHeight: 1.05,
      color: '#fff',
      margin: '0 0 var(--space-4)'
    }
  }, "La tranquilidad", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 800
    }
  }, "est\xE1 en tus manos")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 18,
      lineHeight: 1.5,
      color: 'rgba(255,255,255,0.92)',
      maxWidth: 440,
      margin: '0 0 var(--space-8)'
    }
  }, "Cotiza, contrata y gestiona tus seguros desde la app Sur One. Asistencia 24/7 cuando m\xE1s lo necesitas."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    style: {
      background: '#fff',
      color: 'var(--color-brand-dark)'
    }
  }, "Cotizar mi seguro"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    style: {
      color: '#fff',
      border: '1.5px solid rgba(255,255,255,0.6)'
    }
  }, "Necesito ayuda"))), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/images/hero-app-hands.png",
    alt: "App Sur One",
    style: {
      position: 'absolute',
      right: -40,
      bottom: 0,
      height: '100%',
      maxWidth: 'none',
      objectFit: 'contain',
      objectPosition: 'bottom right'
    }
  }))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.standalone.jsx
try { (() => {
// Hero — cyan banner with the app-in-hand photograph
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--space-8)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      minHeight: 460
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-16) 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.22)',
      color: '#fff',
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      padding: '6px 14px',
      borderRadius: 'var(--radius-pill)',
      marginBottom: 'var(--space-5)'
    }
  }, "+30 a\xF1os protegi\xE9ndote"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 300,
      fontSize: 52,
      lineHeight: 1.05,
      color: '#fff',
      margin: '0 0 var(--space-4)'
    }
  }, "La tranquilidad", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 800
    }
  }, "est\xE1 en tus manos")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 18,
      lineHeight: 1.5,
      color: 'rgba(255,255,255,0.92)',
      maxWidth: 440,
      margin: '0 0 var(--space-8)'
    }
  }, "Cotiza, contrata y gestiona tus seguros desde la app Sur One. Asistencia 24/7 cuando m\xE1s lo necesitas."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    style: {
      background: '#fff',
      color: 'var(--color-brand-dark)'
    }
  }, "Cotizar mi seguro"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    style: {
      color: '#fff',
      border: '1.5px solid rgba(255,255,255,0.6)'
    }
  }, "Necesito ayuda"))), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources.heroImg,
    alt: "App Sur One",
    style: {
      position: 'absolute',
      right: -40,
      bottom: 0,
      height: '100%',
      maxWidth: 'none',
      objectFit: 'contain',
      objectPosition: 'bottom right'
    }
  }))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.standalone.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/PricingSection.jsx
try { (() => {
// PricingSection — Bronce / Plata / Oro auto-insurance tiers
function PricingSection() {
  const {
    Button,
    Badge
  } = window.AseguradoraDelSurDesignSystem_4fbf29;
  const tiers = [{
    name: 'Bronce',
    color: 'var(--tier-bronce)',
    price: 47,
    feats: ['Responsabilidad civil $20.000', 'Muerte $5.000', 'Gastos médicos $3.000', 'Asistencia vial 24/7'],
    featured: false
  }, {
    name: 'Plata',
    color: 'var(--tier-plata)',
    price: 71,
    feats: ['Responsabilidad civil $35.000', 'Muerte $8.000', 'Gastos médicos $5.000', 'Asistencia vial 24/7', 'Auto de reemplazo'],
    featured: false
  }, {
    name: 'Oro',
    color: 'var(--tier-oro)',
    price: 98,
    feats: ['Responsabilidad civil $50.000', 'Muerte $12.000', 'Gastos médicos $8.000', 'Asistencia vial 24/7', 'Auto de reemplazo', 'Daños propios sin deducible'],
    featured: true
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-24) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "t-eyebrow"
  }, "Seguro vehicular"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 300,
      fontSize: 40,
      color: 'var(--text-strong)',
      margin: 'var(--space-2) 0 0'
    }
  }, "Siente tranquilidad en cada viaje")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-6)',
      alignItems: 'start'
    }
  }, tiers.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-8)',
      border: t.featured ? '2px solid var(--color-brand)' : '1px solid var(--border-subtle)',
      boxShadow: t.featured ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transform: t.featured ? 'translateY(-12px)' : 'none',
      position: 'relative'
    }
  }, t.featured && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -13,
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand",
    variant: "solid"
  }, "Recomendado")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 4,
      background: t.color
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 800,
      fontSize: 24,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, t.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 800,
      fontSize: 44,
      color: 'var(--text-strong)'
    }
  }, "$", t.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-muted)'
    }
  }, "/mes*")), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 var(--space-8)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, t.feats.map((f, j) => /*#__PURE__*/React.createElement("li", {
    key: j,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check",
    style: {
      width: 18,
      height: 18,
      color: 'var(--color-success)',
      flex: '0 0 auto',
      marginTop: 1
    }
  }), f))), /*#__PURE__*/React.createElement(Button, {
    variant: t.featured ? 'primary' : 'secondary',
    fullWidth: true
  }, "Contratar ", t.name)))), /*#__PURE__*/React.createElement("p", {
    className: "t-caption",
    style: {
      textAlign: 'center',
      marginTop: 'var(--space-8)'
    }
  }, "*Valor mensual referencial. Sujeto a evaluaci\xF3n y condiciones de la p\xF3liza."));
}
window.PricingSection = PricingSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/PricingSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SegurosSection.jsx
try { (() => {
// SegurosSection — "Nuestros seguros" product grid
function SegurosSection() {
  const {
    Card,
    Badge
  } = window.AseguradoraDelSurDesignSystem_4fbf29;
  const seguros = [{
    icon: 'car',
    name: 'Vehicular',
    desc: 'Protege tu auto ante choques, robo y daños a terceros.',
    tag: 'Más vendido',
    tone: 'success'
  }, {
    icon: 'heart-pulse',
    name: 'Vida',
    desc: 'Respaldo económico para quienes más amas.',
    tag: null
  }, {
    icon: 'stethoscope',
    name: 'Salud',
    desc: 'Atención médica y hospitalaria con cobertura nacional.',
    tag: null
  }, {
    icon: 'home',
    name: 'Hogar',
    desc: 'Cubre tu vivienda contra incendio, robo y desastres.',
    tag: null
  }, {
    icon: 'plane',
    name: 'Asistencia de viaje',
    desc: 'Viaja tranquilo dentro y fuera del país.',
    tag: 'Nuevo',
    tone: 'brand'
  }, {
    icon: 'briefcase',
    name: 'Empresas',
    desc: 'Soluciones a la medida para tu negocio.',
    tag: null
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-24) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "t-eyebrow"
  }, "Nuestros seguros"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 300,
      fontSize: 40,
      color: 'var(--text-strong)',
      margin: 'var(--space-2) 0 var(--space-2)'
    }
  }, "Elige el plan que se ajusta a ti"), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      maxWidth: 560,
      marginTop: 0
    }
  }, "Coberturas pensadas para cada etapa de tu vida, con la solidez de Aseguradora del Sur."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-10)'
    }
  }, seguros.map((s, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    elevation: "md",
    className: "seguro-card",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      transition: 'var(--transition-action)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--cyan-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": s.icon,
    style: {
      width: 26,
      height: 26,
      color: 'var(--color-brand-dark)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, s.name), s.tag && /*#__PURE__*/React.createElement(Badge, {
    tone: s.tone
  }, s.tag)), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0,
      fontSize: 15
    }
  }, s.desc), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      marginTop: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-brand)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-link)',
      textDecoration: 'none'
    }
  }, "Cotizar ", /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-right",
    style: {
      width: 15,
      height: 15
    }
  }))))));
}
window.SegurosSection = SegurosSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SegurosSection.jsx", error: String((e && e.message) || e) }); }

__ds_ns.LoginForm = __ds_scope.LoginForm;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Snackbar = __ds_scope.Snackbar;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.FeedbackIcon = __ds_scope.FeedbackIcon;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.SideNav = __ds_scope.SideNav;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
