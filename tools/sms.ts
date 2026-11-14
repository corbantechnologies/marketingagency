/**
 * GSM 03.38 vs Unicode SMS segment calculation.
 * Mirrors gateway/base.py calculate_segments in the API, so the counter shown to
 * the user matches what the wallet is charged.
 */

export interface SmsSegmentCalculation {
  charCount: number;
  segments: number;
  charsRemaining: number;
  isUnicode: boolean;
  maxSingle: number;
}

// GSM 03.38 basic set (1 septet each) and extension table (2 septets each).
const GSM7_BASIC = new Set(
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?" +
    "¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà"
);
const GSM7_EXTENDED = new Set("^{}\\[~]|€\f");

const segmentsFor = (units: number, single: number, multi: number) =>
  units <= single ? 1 : Math.ceil(units / multi);

export const BaseSMSGateway = {
  calculate_segments(text: string): SmsSegmentCalculation {
    const value = text || "";
    const charCount = Array.from(value).length;

    let septets = 0;
    let isUnicode = false;
    for (const c of Array.from(value)) {
      if (GSM7_BASIC.has(c)) septets += 1;
      else if (GSM7_EXTENDED.has(c)) septets += 2;
      else {
        isUnicode = true;
        break;
      }
    }

    if (charCount === 0) {
      return { charCount: 0, segments: 1, charsRemaining: 160, isUnicode: false, maxSingle: 160 };
    }

    if (!isUnicode) {
      const segments = segmentsFor(septets, 160, 153);
      const capacity = segments === 1 ? 160 : segments * 153;
      return { charCount, segments, charsRemaining: capacity - septets, isUnicode: false, maxSingle: 160 };
    }

    // UCS-2 counts UTF-16 code units (JavaScript string length), so emoji count as 2.
    const units = value.length;
    const segments = segmentsFor(units, 70, 67);
    const capacity = segments === 1 ? 70 : segments * 67;
    return { charCount, segments, charsRemaining: capacity - units, isUnicode: true, maxSingle: 70 };
  },
};
