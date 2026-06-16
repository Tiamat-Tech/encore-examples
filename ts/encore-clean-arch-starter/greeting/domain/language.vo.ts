import { UnsupportedLanguageError } from "./errors/unsupported-language.error";

const SUPPORTED = ["en", "pt", "es"] as const;
type LanguageCode = (typeof SUPPORTED)[number];

/**
 * Language — a Value Object for the greeting language. Validates against the set
 * of supported languages and falls back to the default when none is given.
 */
export class Language {
  static readonly DEFAULT: LanguageCode = "en";

  private constructor(public readonly code: LanguageCode) {}

  static create(raw?: string): Language {
    const code = (raw ?? Language.DEFAULT).toLowerCase();
    if (!SUPPORTED.includes(code as LanguageCode)) {
      throw new UnsupportedLanguageError(code, SUPPORTED);
    }
    return new Language(code as LanguageCode);
  }
}
