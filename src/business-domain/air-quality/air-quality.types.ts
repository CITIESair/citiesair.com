// ============================================================
// Unified AQI type definitions for frontend
// Adapted from backend air-quality.types.ts with frontend-specific additions:
// - Multi-language support (en/lg) for categories and health suggestions
// - Light/Dark theme colors
// ============================================================

import type { DataTypeKey } from "../data-types/data-type.types";
import type { TemperatureUnit } from "./temperature.utils";

// --- Primitives ---

/**
 * A breakpoint range used in AQI/CO2/VOC/HeatIndex threshold databases.
 * Represents a [low, high] inclusive range for a measurement category.
 */
export interface Threshold {
  low: number;
  high: number;
}

/**
 * Multi-language text support (English and Luganda).
 */
export interface MultiLanguageText {
  en: string;
  lg: string;
}

/**
 * Context-specific health suggestions for an air quality category.
 * Each key represents a location context (outdoors, generic indoors, etc.).
 * Frontend supports multi-language for outdoors suggestions.
 */
export interface HealthSuggestions {
  outdoors: MultiLanguageText | string;
  indoors_generic: MultiLanguageText | string;
  indoors_dining_hall: MultiLanguageText | string;
  indoors_gym: MultiLanguageText | string;
  indoors_vulnerable: MultiLanguageText | string;
}

/**
 * Theme-aware color configuration.
 */
export interface ThemeColor {
  Light: string;
  Dark: string;
}

// --- Base Category Database Entry ---

/**
 * A single entry in a category threshold database (AQI_Database, CO2_Database, etc.).
 * Contains the category metadata and health guidance for one air quality level.
 * With optional keys from DataTypeKey or heat_index_F for different data types
 */
interface CategoryEntry {
  id: number;
  category: MultiLanguageText | string;
  color: ThemeColor;
  description: string;
  healthSuggestions: HealthSuggestions;
}
export type BaseCategory = CategoryEntry & {
  [K in DataTypeKey]?: Threshold;
} & {
  heat_index_F?: Threshold;
};

// --- Result Types ---

/**
 * Base result for any categorized environmental measurement.
 * Returned by any function that classifies a raw value into a category.
 */
export interface CategoryResult {
  /** The processed/computed value (null when no data is available). */
  val: number | null;
  /** Index into the category database (0 = best, ascending = worse). Null when no data. */
  categoryIndex: number | null;
  /** Human-readable category name (can be multi-language object or string). */
  category: MultiLanguageText | string | null;
}

/**
 * Extended result that includes visual and health metadata.
 * Returned when additional display information is needed.
 */
export interface DetailedCategoryResult extends CategoryResult {
  /** Theme-aware color associated with the category. */
  color?: ThemeColor;
  /** Health guidance text for different location contexts. */
  healthSuggestions?: HealthSuggestions;
  /** Description of the category's health impact. */
  description?: string;
}

/**
 * Result from calculating AQI for a single pollutant (PM2.5, PM10).
 * Extends DetailedCategoryResult with the computed AQI number.
 */
export interface SinglePollutantAQIResult extends DetailedCategoryResult {
  /** The computed AQI value (null when no data). */
  aqi: number | null;
}

// --- Heat Index Calculator Params ---

/**
 * Parameters for the heat index calculation function.
 */
export interface HeatIndexParams {
  rawTemp: number | null | undefined;
  tempUnit?: TemperatureUnit;
  rel_humidity: number | null | undefined;
}