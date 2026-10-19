const brightCanvasDitherOptions = {
  serpentine: true,
  errorDiffusionMatrix: "floydSteinberg",
};

// Exposure steps checked on Spectra 6 output (natural intent, Floyd–Steinberg dither).
const brightnessBoostLevels = [
  null,
  {
    cssFilter: "brightness(1.08) contrast(1.02)",
    epdOptimize: {
      intent: "natural",
      imageAdjustmentOptions: {
        toneMapping: {
          exposure: 0.15,
          contrast: 0.02,
          saturation: 0,
          strength: 0.16,
          shadowBoost: 0.11,
          highlightCompress: -0.05,
          midpoint: 0.5,
        },
        dynamicRangeCompression: {
          mode: "display",
          strength: 0.22,
          lowPercentile: 0.02,
          highPercentile: 0.99,
        },
      },
      canvasDitherOptions: brightCanvasDitherOptions,
    },
  },
  {
    cssFilter: "brightness(1.16) contrast(1.03)",
    epdOptimize: {
      intent: "natural",
      imageAdjustmentOptions: {
        toneMapping: {
          exposure: 0.29,
          contrast: 0.04,
          saturation: 0,
          strength: 0.32,
          shadowBoost: 0.23,
          highlightCompress: -0.09,
          midpoint: 0.5,
        },
        dynamicRangeCompression: {
          mode: "display",
          strength: 0.44,
          lowPercentile: 0.02,
          highPercentile: 0.99,
        },
      },
      canvasDitherOptions: brightCanvasDitherOptions,
    },
  },
  {
    cssFilter: "brightness(1.24) contrast(1.05)",
    epdOptimize: {
      intent: "natural",
      imageAdjustmentOptions: {
        toneMapping: {
          exposure: 0.44,
          contrast: 0.06,
          saturation: 0,
          strength: 0.48,
          shadowBoost: 0.34,
          highlightCompress: -0.14,
          midpoint: 0.5,
        },
        dynamicRangeCompression: {
          mode: "display",
          strength: 0.66,
          lowPercentile: 0.02,
          highPercentile: 0.99,
        },
      },
      canvasDitherOptions: brightCanvasDitherOptions,
    },
  },
];

export function normalizeBrightnessBoost(value) {
  if (value === undefined || value === null || value === "") {
    return 0;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(3, Math.round(value)));
  }
  const leadingDigit = String(value).trim().match(/^(\d)/);
  if (!leadingDigit) {
    return 0;
  }
  return Math.max(0, Math.min(3, Number(leadingDigit[1])));
}

export function defaultEpdOptimizeMeta() {
  return { intent: "natural" };
}

/** @param {number} level 0–3 */
export function brightnessBoostEpdMeta(level) {
  const config = brightnessBoostLevels[level];
  return config?.epdOptimize ?? null;
}

/** @param {number} level 0–3 */
export function brightnessBoostCssFilter(level) {
  const config = brightnessBoostLevels[level];
  return config?.cssFilter ?? "";
}
