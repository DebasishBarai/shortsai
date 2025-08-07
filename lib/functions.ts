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

  if (type === "VoiceType") {
    switch (input) {
      case "Joanna":
        return "Joanna, Female"
      case "Salli":
        return "Salli, Female"
      case "Kimberly":
        return "Kimberly, Female"
      case "Kendra":
        return "Kendra, Female"
      case "Ivy":
        return "Ivy, Female"
      case "Matthew":
        return "Matthew, Male"
      case "Justin":
        return "Justin, Male"
      case "Joey":
        return "Joey, Male"
      default:
        return input
    }
  }

  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Insert space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
}
