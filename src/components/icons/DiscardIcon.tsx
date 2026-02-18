import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

export function DiscardIcon({ size = 16, color = "#a1a1aa" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 18L18 6M6 6l12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
