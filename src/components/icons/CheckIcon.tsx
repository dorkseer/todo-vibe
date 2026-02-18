import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

export function CheckIcon({ size = 12, color = "#fff" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
