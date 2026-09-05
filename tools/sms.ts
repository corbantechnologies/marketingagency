/**
 * GSM 03.38 vs Unicode SMS Calculation Utilities
 */

export interface SmsSegmentCalculation {
  charCount: number;
  segments: number;
  charsRemaining: number;
  isUnicode: boolean;
  maxSingle: number;
}

export const BaseSMSGateway = {
  calculate_segments(text: string): SmsSegmentCalculation {
    const charCount = text ? text.length : 0;
    const isUnicode = /[^\u0000-\u007F]/.test(text || "");

    if (charCount === 0) {
      return {
        charCount: 0,
        segments: 1,
        charsRemaining: isUnicode ? 70 : 160,
        isUnicode,
        maxSingle: isUnicode ? 70 : 160,
      };
    }

    if (!isUnicode) {
      if (charCount <= 160) {
        return {
          charCount,
          segments: 1,
          charsRemaining: 160 - charCount,
          isUnicode: false,
          maxSingle: 160,
        };
      }
      const segments = Math.ceil(charCount / 153);
      const charsRemaining = segments * 153 - charCount;
      return {
        charCount,
        segments,
        charsRemaining,
        isUnicode: false,
        maxSingle: 160,
      };
    } else {
      if (charCount <= 70) {
        return {
          charCount,
          segments: 1,
          charsRemaining: 70 - charCount,
          isUnicode: true,
          maxSingle: 70,
        };
      }
      const segments = Math.ceil(charCount / 67);
      const charsRemaining = segments * 67 - charCount;
      return {
        charCount,
        segments,
        charsRemaining,
        isUnicode: true,
        maxSingle: 70,
      };
    }
  },
};
