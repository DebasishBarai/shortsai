interface ValueToLabelOptions {
  type: "SubscriptionType" | "ContentType" | "VideoStyle" | "VideoDuration" | "VoiceType" | "AspectRatio";
  input: string;
}

export function convertValueToLabel({ type, input }: ValueToLabelOptions): string {
  if (type === "AspectRatio") {
    return input.replace('RATIO_', '').replace('_', ':')
  }

  if (type === "VideoDuration") {
    return input.replace('DURATION_', '') + ' sec'
  }

  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Insert space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
}
