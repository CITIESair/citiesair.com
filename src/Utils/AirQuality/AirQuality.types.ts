// ============================================================
// Unified AQI type definitions for frontend
// Adapted from backend air-quality.types.ts with frontend-specific additions:
// - Multi-language support (en/lg) for categories and health suggestions
// - Light/Dark theme colors
// ============================================================

import type { DataTypeKey } from "./DataTypes";
import type { TemperatureUnit } from "./TemperatureUtils";

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
  indoors_generic: string;
  indoors_dining_hall: string;
  indoors_gym: string;
  indoors_vulnerable: string;
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
 * Frontend uses theme-aware colors and multi-language category names.
 */
export interface BaseCategory {
  id: number;
  category: MultiLanguageText | string;
  color: ThemeColor;
  description?: string;
  healthSuggestions?: HealthSuggestions;
  // Threshold mappings - keys vary by database type
  aqiUS?: Threshold;
  rawPM2_5?: Threshold;
  rawPM10?: Threshold;
  rawCO2?: Threshold;
  rawVOC?: Threshold;
  heat_index_F?: Threshold;
  heat_index_C?: Threshold;
}

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

/**
 * Result from calculating the overall AQI across multiple pollutants.
 * The overall AQI is the maximum AQI among all considered pollutants.
 */
export interface OverallAQIResult extends CategoryResult {
  /** Short name of the pollutant with the highest AQI (e.g., "PM2.5"). */
  majorPollutant: string;
}

/**
 * Result from calculating the heat index.
 */
export interface HeatIndexResult {
  /** The computed heat index value. */
  val: number;
  /** Human-readable category name, or null if outside known ranges. */
  category: string | null;
  /** Index into the HeatIndex_Database. */
  categoryIndex: number;
}

/**
 * Return type for processValueForDatatype().
 * The function can return a SinglePollutantAQIResult (for PM2.5/PM10),
 * a DetailedCategoryResult (for CO2/VOC/heat_index/AQI), or a
 * bare { val } object (for temperature/pressure/humidity).
 */
export interface ProcessedValue {
  /** The processed/computed value (null when no data is available). */
  val: number | null;
  /** Present only for PM2.5 and PM10 data types. */
  aqi?: number | null;
  /** Index into the category database. */
  categoryIndex?: number | null;
  /** Human-readable category name. */
  category?: MultiLanguageText | string | null;
  /** Theme-aware color associated with the category. */
  color?: ThemeColor;
  /** Health guidance text for different location contexts. */
  healthSuggestions?: HealthSuggestions;
  /** Description of the category's health impact. */
  description?: string;
}

/**
 * Lightweight data shape used for tooltip formatting in calendar charts.
 * Accepts string values since it handles already-formatted display values.
 */
export interface CalendarDataPoint {
  val: number | string;
  aqi?: number | string;
  category?: string;
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

/**
 * Return type for calculateAQI function.
 */
export interface AQIResult {
  val: number | null;
  aqi: number | null;
  categoryIndex: number | null;
  category: MultiLanguageText | string;
  color?: ThemeColor;
}
