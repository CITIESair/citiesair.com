/**
 * Type definitions for section_data.json — the static textual
 * content consumed by most UI elements across the app.
 *
 * Design decisions:
 * - `LocalizedText` uses an index signature so new language keys
 *   can be added without touching the types. Only `en` is required
 *   because it serves as the fallback in `getTranslation`.
 * - Common shapes (`Section`, `TextSection`, `AuthSection`, …) are
 *   composed via interface extension to avoid repetition.
 */

// ---------------------------------------------------------------------------
// Localization
// ---------------------------------------------------------------------------

/**
 * Text that can be translated to multiple languages.
 * `en` is always required as the fallback language.
 * Additional language codes (e.g. "lg", "ar") may be added freely.
 */
export interface LocalizedText {
  en: string;
  [lang: string]: string;
}

// ---------------------------------------------------------------------------
// Section base types
// ---------------------------------------------------------------------------

/** Every section has a unique string identifier. */
export interface Section {
  id: string;
}

/** A section whose content is a single HTML string. */
export interface TextSection extends Section {
  content: string;
}

// ---------------------------------------------------------------------------
// Auth (login / signup)
// ---------------------------------------------------------------------------

/** Role-based copy shared by both login and signup. */
export interface AuthContent {
  school: string;
  individual: string;
  exception: string;
}

export interface AuthSection extends Section {
  title: string;
  content: AuthContent;
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export interface AboutContentItem {
  mainText: string;
  reference?: string;
}

export interface AboutSection extends Section {
  content: AboutContentItem[];
}

// ---------------------------------------------------------------------------
// Promos
// ---------------------------------------------------------------------------

export interface PromoImage {
  width: string;
  src: string;
  /** Alt text for the image (key is "atl" in the data). */
  atl: string;
}

export interface PromoBanner {
  title: string;
  subtitle: string;
  img: PromoImage;
}

export interface Promo {
  id: string;
  expired: boolean;
  isPublic: boolean;
  alertMessage: string;
  banner: PromoBanner;
}

// ---------------------------------------------------------------------------
// At-A-Glance statistics
// ---------------------------------------------------------------------------

export interface AtAGlanceItem {
  order: number;
  text: LocalizedText;
  icon: string;
}

export interface AtAGlanceSection extends Section {
  content: Record<string, AtAGlanceItem>;
}

// ---------------------------------------------------------------------------
// Localized sections (screen, allSensorsScreen, status)
// ---------------------------------------------------------------------------

/** A section whose content entries are all localized text. */
export interface LocalizedSection extends Section {
  content: Record<string, LocalizedText>;
}

// ---------------------------------------------------------------------------
// Root type
// ---------------------------------------------------------------------------

export interface SectionData {
  siteDescription: string;
  login: AuthSection;
  signup: AuthSection;
  charts: Section;
  topAnchor: Section;
  about: AboutSection;
  commentSection: TextSection;
  disclaimer: TextSection;
  publicOutdoorStations: TextSection;
  getInTouch: TextSection;
  promos: Promo[];
  atAGlance: AtAGlanceSection;
  screen: LocalizedSection;
  allSensorsScreen: LocalizedSection;
  status: LocalizedSection;
}
