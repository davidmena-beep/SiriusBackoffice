# Aseguradora del Sur — Design System (“Marca ADS”)

A brand & product design system for **Aseguradora del Sur**, one of Ecuador's established insurance companies (seguros vehicular, vida, salud, hogar, empresas), and its companion mobile app sub-brand **Sur One**. Rebuilt from the company's Figma design library (atomic-design structure: *Protones › tomos › Moléculas › Organismos › Plantillas*).

This folder is the source of truth for the brand's colors, typography, spacing, logos, illustrations, reusable UI components and full-screen UI kits. An automated compiler indexes `styles.css` and the components into a runtime bundle (`_ds_bundle.js`, namespace `window.AseguradoraDelSurDesignSystem_4fbf29`).

## Source

- **GitHub:** <https://github.com/rolandop/system-design-ads> (branch `main`) — this project was imported from that repository; browse it for the full original sources and history when you need more detail than this guide carries. See `github.md` for the sync record.
- **Figma:** “Design System - Aseguradora del Sur.fig” (attached). Pages: Cover, Documentos, Protones (foundations), tomos (atoms), Moléculas, Organismos, Plantillas (templates). Foundations live in *Protones › Pro - Colores / Tipografía / Logo / Íconos / Illustraciones*.
- No public codebase was provided; all values were extracted from the Figma file.

## Two brands in this system

- **Aseguradora del Sur** — the parent insurer. Mark is a four-pointed **star isotipo** (cyan + royal-blue facets) with the lowercase wordmark “aseguradora del sur”. Palette built on **brand cyan `#00AEEF`** + **navy `#011E41`**.
- **Sur One** — the customer mobile app. Mark is a rounded-square app icon (purple `#4D16C4`) with a pink/cyan arrow; wordmark sets “Sur” in purple and “One” in pink. Uses **Inter**. Treat Sur One as a sub-brand inside ADS contexts.

---

## CONTENT FUNDAMENTALS

How the brand writes (all UI/marketing copy is in **Spanish, Ecuador**):

- **Voice:** warm, reassuring, protective — selling *tranquilidad* (peace of mind). Confident but human; never cold or bureaucratic.
- **Address:** second person informal **“tú/tu”** — *“Protege lo que más te importa”, “Elige el plan que se ajusta a ti”, “Realiza el seguimiento de tus siniestros”*. The brand speaks *to* the customer, not about itself.
- **Casing:** Sentence case for headings and buttons (*“Cotizar mi seguro”, “Contrata con nosotros”*). Eyebrows/section kickers may be UPPERCASE small caps.
- **Headlines:** short, benefit-led, often a light-weight phrase with one bold word for emphasis (*“La tranquilidad **está en tus manos**”*).
- **Buttons/CTAs:** imperative verbs — *Cotizar, Contratar, Reportar siniestro, Recibir, Descargar póliza, Ingresar*. Usually 1–3 words.
- **Numbers & money:** USD (Ecuador is dollarized). Prices shown as `$47/mes*` with a `*` footnote “Valor mensual referencial”. Coverage amounts like `$20.000` (period thousands separator).
- **Tone of trust:** leans on heritage (*“+30 años”*), local pride (*“empresa 100% ecuatoriana”*) and service (*“Soporte 24/7”, “El cliente va primero”*).
- **Emoji:** not used in product UI. (The Figma includes a set of yellow *emoticon* illustrations for reactions, but not inline emoji in copy.)
- **Terminology:** *seguro, póliza, siniestro, cobertura, deducible, indemnización, asegurado, agente/asesor.* Use these exact insurance terms.

---

## VISUAL FOUNDATIONS

**Color.** The system is unmistakably **cyan + navy**. Brand cyan `#00AEEF` is the hero color (heroes, CTAs, active states, icon chips); navy `#011E41` carries text, dark sections and the footer. Royal blue `#0033A1` is the secondary. A **teal** accent `#4F8488` / wash `#E8F4F4` provides quiet alternating section backgrounds. Neutrals run navy→white. Semantic set: success green `#4C8C1E`, warning gold `#C99A06`, danger red `#9E1B0E`. Plan tiers have their own accents (Bronce/Plata/ Oro). Sur One adds purple/pink/cyan. Tokens in `tokens/colors.css`.

**Type.** Brand face is **Avenir** (geometric humanist sans) — **substituted here with Mulish** (closest free Google match; see Caveats). Display/H1–H2 are set **Light (300)** at large sizes for an airy, premium feel; H3–H6 Medium (500); emphasis Bold (700/800). Body is Regular 16px at 150% line-height. Headings sit at 100% line-height. Sur One uses **Inter**. Tokens in `tokens/typography.css`.

**Spacing & layout.** 4px base grid (`--space-*`). Generous section padding (96px vertical on marketing). Centered max-width containers (\~1200px). Grids with `gap` (3-up product/feature grids).

**Corners.** Soft, friendly radii: buttons & inputs **8px**, content cards 16px, feature cards 24px, hero/specimen cards a pronounced **40px**, pills/FABs/avatars fully round. (`--radius-*`.)

**Cards.** White surfaces, no border by default, lifted with soft navy-tinted shadows. Hover lifts the card (`translateY(-6px)`) and deepens the shadow.

**Elevation (from the Figma “Sombras” spec).** Four levels: `button` `0 4 8 rgba(0,174,239,.24)` (a **cyan glow** unique to CTAs), `sm/cajita` `0 4 8 navy/12%`, `md/caja` `0 12 20 navy/8%`, `modal` `0 20 80 navy/12%`. (`--shadow-*`.)

**Backgrounds.** Mostly clean white with alternating teal-wash (`#E8F4F4`) bands; the hero is a **full-bleed brand-cyan** band with a photographic cut-out (hands holding the app). Dark navy footer. No gradients, no noise, no heavy textures.

**Imagery.** Bright, warm photography of real people/hands, often composited on a flat cyan background. Spot illustrations are **light-cyan organic blobs** behind simple line-icon subjects (empty states, confirmations, loaders) — soft, optimistic.

**Inputs.** Underline style (no boxed borders): label above, value, 2px bottom border that turns cyan on focus / red on error, optional trailing icon.

**Motion (from the “Transitions” spec).** Restrained, ease-out. Actions/selects/ tooltips/submenus **320ms ease-out**; snack bars **200ms** move-in; side modals **800ms** gentle move-in; loaders **240ms linear**. Hover = color deepen (`#00AEEF → #008BBF`) + optional shadow; no bounces. Scrims: submenu `black/12%`, modal `black/40%`, drawer `black/20%`. (`--dur-*`, `--ease-*`, `--scrim-*`.)

**Hover/press.** Primary button hover deepens to brand-dark and gains the cyan glow. Secondary hover fills with cyan wash. Links lower opacity. Nav items reveal a cyan underline. Disabled = neutral-300 fill / neutral-500 text.

---

## ICONOGRAPHY

The Figma “Íconos” page defines two families:

1. **UI line icons** — a large thin-stroke outline set (arrows, functions, informative, objects, communication, media, devices, views, weather, characters, user). Stroke style is **Feather/Lucide-like** (2px, rounded joins). **Substituted here with [Lucide](https://lucide.dev) via CDN** — the closest free match — used across the UI kits. Swap for the real ADS icon assets in production.
2. **“Servicios” brand icons** — bespoke, **filled/duotone insurance icons inside circular cyan/navy chips** (cars, umbrellas, shields, medical, etc.). These are proprietary and should be exported from Figma when needed; the UI kits approximate them with Lucide line icons inside cyan chips.

Also present: payment-brand marks (Visa/Mastercard/Amex/Diners), trust seals (PCI, Datafast) and the **Sur One app** line-icon set. Emoji are **not** used as icons; Unicode glyphs are not used as icons either.

---

## INDEX / MANIFEST

**Root**

- `styles.css` — import-only entry point (links every token + font file).
- `readme.md` — this guide. `SKILL.md` — Agent Skill wrapper.

**`tokens/`** — `colors.css`, `typography.css`, `spacing.css` (spacing/radius/ shadow/motion), `fonts.css` (Mulish + Inter via Google Fonts), `components.css` (component-level aliases for Alert/Modal/Spinner/Snackbar/Input/Button, z-index, keyframes, autofill hook).

**`components/`** (React primitives, namespace `AseguradoraDelSurDesignSystem_4fbf29`)

- `buttons/` → **Button** (variants, sizes, `loading`)
- `forms/` → **Input** (onBlur validation, autofill, Bloq Mayús) **· Checkbox · Radio · Switch**
- `auth/` → **LoginForm** (Iniciar sesión: correo + contraseña outlined, eye toggle, olvidaste tu contraseña, Ingresar)
- `templates/login/` → **Login** · `templates/sitio-web/` → **Sitio web** · `templates/portal-clientes/` → **Portal de clientes** (seguimiento de siniestros)
- `templates/portal-interno/` → **Portal interno** (template genérico: SideNav + barra superior + cabecera + tabla/empty state + footer). Renovaciones es solo un ejemplo de uso.
- `navigation/` → **SideNav** (menú lateral colapsable: rail de iconos ↔ expandido con submenús)
- `feedback/` → **Alert · Modal · Spinner · Snackbar** (+ internal `FeedbackIcon`, Lucide geometry)
- `display/` → **Card · Badge · Avatar**
- `navigation/` → **Tabs** Each has `<Name>.jsx`, `.d.ts`, `.prompt.md`, and a `@dsCard` HTML.

**`guidelines/`** — foundation specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab.

**`ui_kits/`**

- `website/` — ADS marketing homepage (hero, products, tiers, footer).
- `siniestros/` — claims-tracking portal (stepper, timeline, detail).
- `login/` — **Iniciar sesión** split screen: header + logo, office photo, LoginForm, royal-blue footer; recovery Modal + Snackbar.
- `renovaciones/` — **Módulo de renovaciones de fianzas** (admin): top bar, icon sidebar, sortable data table + pagination, "Nuevo pedido" form modal, "Detalles" sheet, royal-blue footer. The canonical pattern for internal admin modules.

**`assets/`**

- `logos/` — `ads-vertical.png`, `ads-horizontal.png`, `ads-isotipo.svg` (transparent), `sur-one.png`, `sur-one-icon.png`.
- `illustrations/` — `empty-state.png`.
- `images/` — `hero-app-hands.png`, `login-office.png` (login photo, cropped from the reference screenshot — replace with the original hi-res file).

---

## COMPONENT SPEC — Feedback & form states (v1.1, 2026-09-30)

| Component | Use | Key tokens | States | Accessibility |
|---|---|---|---|---|
| **Alert** | Persistent inline validation/feedback in forms & sections | `--alert-{tone}-bg/-fg`, `--alert-radius` 8px, `--alert-padding` | tones info·success·warning·danger; sizes md·sm; dismissible | danger/warning → `role="alert"`; info/success → `role="status"`; text always navy (≥4.5:1); no left-accent stripe |
| **Modal** | Dialogs & overlay tasks | `--modal-radius` 24px, `--modal-padding` 40px, `--modal-width-sm/md/lg` 420/600/860, `--modal-scrim`, `--z-modal` | open/closed; sizes; title center/left | `role="dialog"` + `aria-modal`, labelled by title, focus trap, Esc/scrim close, focus restore, scroll lock |
| **Spinner** | Loading of a specific element | `--spinner-track/-arc`, `--spinner-size-sm/md/lg` 16/24/40, `--dur-spin` 800ms | tones brand·onBrand·current | `role="status"`, hidden label "Cargando"; slows under reduced-motion |
| **Snackbar** | Brief transient notice | `--snackbar-bg` navy, `--snackbar-action` cyan-300, `--snackbar-duration` 5s, `--z-snackbar` | tones default·success·danger; one action | `role="status"` polite (danger → alert); pauses on hover/focus; Esc closes |
| **Input** (ext.) | + validation, autofill, Bloq Mayús | `--input-success`, `--input-autofill-bg`, `--input-capslock-fg/-bg` | default·focus·error·success·autofilled·capslock·disabled | `aria-invalid`, `aria-describedby` → helper/error/caps; `validateOn="blur"` default, re-validates on change once in error |
| **Input** `variant="outlined"` | Boxed 48px field (login, admin) | `--input-outlined-height`, `--input-outlined-border`, radius 8 | same states; label → placeholder (SR-only label); password eye toggle | toggle has `aria-label` Mostrar/Ocultar contraseña + `aria-pressed` |
| **LoginForm** | Iniciar sesión panel | `--login-form-width` 280, `--login-title-size` 28, `--login-submit-disabled-bg` | empty (CTA light-cyan disabled) · invalid email (onBlur) · loading · auth error | form `aria-labelledby` title, `aria-busy`; error Alert focused; `autocomplete` username/current-password; generic error copy |
| **Button** (ext.) | + `loading` | `--button-loading-opacity` | loading (spinner, width preserved) · loadingText | `aria-busy`, `aria-disabled`, stays focusable, clicks ignored |

CSS class hooks (for overrides/tests): `ads-button--loading`, `ads-input--{state}`, `ads-input--autofilled`, `ads-input--capslock`, `ads-input__control`, `ads-alert--{tone}`, `ads-modal__scrim`, `ads-modal__dialog`, `ads-spinner__arc`, `ads-snackbar--{tone}`.

**Usage rules:** Alert = stays until resolved; Snackbar = ≤2 lines, disappears, never critical; Modal = interrupts, always titled; Spinner = local wait — for buttons use `<Button loading>`.

## CAVEATS / SUBSTITUTIONS

- **Avenir → Mulish.** The brand font Avenir is not web-licensed here; Mulish is the closest free substitute. Drop in licensed Avenir webfonts (update `tokens/fonts.css` + `--font-brand`) for production fidelity.
- **Icons → Lucide (CDN).** Substitute for the brand line-icon set; the bespoke “Servicios” colored icons should be exported from Figma when pixel-accuracy matters.
- Logos and the empty-state illustration were rasterized (PNG) from the Figma vectors except the **isotipo**, which is a clean transparent SVG.
