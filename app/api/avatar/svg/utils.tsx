const ELEMENTS = 4;
const SIZE = 80;

const AvatarMarble = (props: any) => {
  const properties = generateColors(props.name, props.colors);
  const maskID = String(hashCode(props.name));

  return (
    <svg
      viewBox={"0 0 " + SIZE + " " + SIZE}
      fill="none"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
    >
      {props.title && <title>{props.name}</title>}
      <mask
        id={maskID}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={SIZE}
        height={SIZE}
      >
        <rect
          width={SIZE}
          height={SIZE}
          rx={props.square ? undefined : SIZE * 2}
          fill="#fff"
        />
      </mask>
      <g mask={`url(#${maskID})`}>
        <rect width={SIZE} height={SIZE} fill={properties[0].color} />
        <path
          filter={`url(#filter_${maskID})`}
          d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
          fill={properties[1].color}
          transform={
            "translate(" +
            properties[1].translateX +
            " " +
            properties[1].translateY +
            ") rotate(" +
            properties[1].rotate +
            " " +
            SIZE / 2 +
            " " +
            SIZE / 2 +
            ") scale(" +
            properties[1].scale +
            ")"
          }
        />
        <path
          filter={`url(#filter_${maskID})`}
          style={{
            mixBlendMode: "overlay",
          }}
          d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
          fill={properties[2].color}
          transform={
            "translate(" +
            properties[2].translateX +
            " " +
            properties[2].translateY +
            ") rotate(" +
            properties[2].rotate +
            " " +
            SIZE / 2 +
            " " +
            SIZE / 2 +
            ") scale(" +
            properties[2].scale +
            ")"
          }
        />
        <path
          filter={`url(#filter_${maskID})`}
          d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
          fill={"rgba(255, 255, 255, .25"}
          transform={
            "translate(" +
            properties[3].translateX +
            " " +
            properties[3].translateY +
            ") rotate(" +
            properties[3].rotate +
            " " +
            SIZE / 2 +
            " " +
            SIZE / 2 +
            ") scale(" +
            properties[3].scale +
            ")"
          }
        />
      </g>
      <defs>
        <filter
          id={`filter_${maskID}`}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={8} result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
};

const generateColors = (name: string, colors: string | any[]) => {
  const numFromName = hashCode(name);
  const range = colors && colors.length;

  const elementsProperties = Array.from({ length: ELEMENTS }, (_, i) => ({
    color: getRandomColor(numFromName + i, colors, range),
    translateX: getUnit(numFromName * (i + 1), SIZE / 10, 1),
    translateY: getUnit(numFromName * (i + 1), SIZE / 10, 2),
    scale: 1.2 + getUnit(numFromName * (i + 1), SIZE / 20) / 10,
    rotate: getUnit(numFromName * (i + 1), 360, 1),
  }));

  return elementsProperties;
};

const hashCode = (name: string) => {
  var hash = 0;
  for (var i = 0; i < name.length; i++) {
    var character = name.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const getUnit = (number: number, range: number, index?: number) => {
  let value = number % range;

  if (index && getDigit(number, index) % 2 === 0) {
    return -value;
  } else return value;
};

const getDigit = (number: number, ntn: number) => {
  return Math.floor((number / Math.pow(10, ntn)) % 10);
};

const getRandomColor = (number: number, colors: string | any[], range: any) => {
  return colors[number % range];
};

export const defaultColors = [
  "#84bfc3",
  "#fff5d6",
  "#ffb870",
  "#d96153",
  "#000511",
];

export const respondWithSVG = async (name: string, size: number) => {
  const avatarProps = {
    colors: defaultColors,
    name,
    title: name,
    size,
    square: true,
  };
  const ReactDOMServer = (await import("react-dom/server")).default;
  const svg = ReactDOMServer.renderToString(<AvatarMarble {...avatarProps} />);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
      "CDN-Cache-Control": "public, s-maxage=604800",
    },
  });
};
