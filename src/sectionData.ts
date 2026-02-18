/**
 * Typed re-export of section_data.json.
 *
 * All UI components should import from this module instead of
 * importing the raw JSON directly, so the data is properly typed
 * throughout the codebase.
 */
import data from './section_data.json';
import type { SectionData } from './types/SectionData';

const sectionData: SectionData = data as SectionData;

export default sectionData;
