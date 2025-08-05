import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique patient ID based on the specified format:
 * - First 2 characters: Last 2 digits of the current year
 * - Next 2 characters: Country code (e.g., NP, IN, US)
 * - Remaining characters: Sequential number with padding
 * 
 * The format evolves as follows:
 * 1. Initial format: YYCCSSSSS (e.g., 25NP00001) - 9 characters
 * 2. When numbers exhaust: YYCCSSSSSA (e.g., 25NP00001A) - 10 characters
 * 3. When single letters exhaust: YYCCSSSSSZAA (e.g., 25NP00001ZA) - 11+ characters
 * 
 * @param country - The country code (e.g., 'NP', 'IN', 'US')
 * @param existingIds - Array of existing patient IDs to ensure uniqueness
 * @returns A unique patient ID string
 */
export async function generatePatientId(supabase: any, countryName: string) {
  // Get country code (2 letters)
  const countryCode = getCountryCode(countryName);
  
  // Get year suffix (last 2 digits of current year)
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  
  // Prefix is combination of year and country code
  const prefix = `${yearSuffix}${countryCode}`;
  
  // Get the latest patient ID with this prefix
  const { data } = await supabase
    .from('users')
    .select('patient_id')
    .like('patient_id', `${prefix}%`)
    .order('patient_id', { ascending: false })
    .limit(1);
  
  if (!data || data.length === 0) {
    // No existing IDs with this prefix, start with 00001
    return `${prefix}00001`;
  }
  
  const latestId = data[0].patient_id;
  return incrementPatientId(latestId, prefix);
}

/**
 * Extracts a 2-letter country code from the country name
 */
function getCountryCode(countryName: string): string {
  // Map of country names to their 2-letter codes
  const countryCodeMap: Record<string, string> = {
    'Nepal': 'NP',
    'India': 'IN',
    'United States': 'US',
    // Add more countries as needed
  };
  
  return countryCodeMap[countryName] || countryName.slice(0, 2).toUpperCase();
}

/**
 * Increments the patient ID following the specified format rules
 */
function incrementPatientId(currentId: string, prefix: string): string {
  // Extract the numeric/alphanumeric part after the prefix
  const suffixPart = currentId.slice(prefix.length);
  
  // Case 1: Pure numeric suffix (e.g., 25NP00001)
  if (/^\d+$/.test(suffixPart)) {
    const numericPart = parseInt(suffixPart, 10);
    
    // If we haven't reached 99999 yet, just increment
    if (numericPart < 99999) {
      return `${prefix}${(numericPart + 1).toString().padStart(5, '0')}`;
    }
    
    // We've reached 99999, move to format with single letter suffix
    return `${prefix}00001A`;
  }
  
  // Case 2: Numeric with single letter suffix (e.g., 25NP00001A)
  if (/^\d+[A-Z]$/.test(suffixPart)) {
    const numericPart = suffixPart.slice(0, -1);
    const letterPart = suffixPart.slice(-1);
    
    // If letter isn't Z, just increment the letter
    if (letterPart !== 'Z') {
      const nextLetter = String.fromCharCode(letterPart.charCodeAt(0) + 1);
      return `${prefix}${numericPart}${nextLetter}`;
    }
    
    // We've reached Z, move to format with multiple letter suffix
    return `${prefix}${numericPart}ZA`;
  }
  
  // Case 3: Complex alphanumeric suffix (e.g., 25NP00001ZA)
  // This handles all other cases with multiple letter suffixes
  const match = suffixPart.match(/^(\d+)([A-Z]+)$/);
  if (match) {
    const [, numericPart, lettersPart] = match;
    
    // Increment the letters part as if it were a number in base 26
    let carry = true;
    const letters = lettersPart.split('');
    
    for (let i = letters.length - 1; i >= 0; i--) {
      if (carry) {
        if (letters[i] === 'Z') {
          letters[i] = 'A';
          carry = true; // Continue carrying to next position
        } else {
          letters[i] = String.fromCharCode(letters[i].charCodeAt(0) + 1);
          carry = false; // No need to carry anymore
        }
      }
    }
    
    // If we still have a carry, we need to add another 'A' at the beginning
    if (carry) {
      letters.unshift('A');
    }
    
    return `${prefix}${numericPart}${letters.join('')}`;
  }
  
  // Fallback case (should never happen with proper data)
  return `${prefix}00001`;
}
