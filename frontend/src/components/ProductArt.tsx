function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 33 + value.charCodeAt(i)) >>> 0;
  return h;
}

const wraps = ["#6e2430", "#1e4636", "#24324d", "#5c331c", "#6b3b45"];

export function ProductArt({
  slug,
  category,
  className,
}: {
  slug: string;
  category: string;
  className?: string;
}) {
  const n = hash(slug || category);
  const wrap = wraps[n % wraps.length];
  const accent = n % 2 === 0 ? "#e4c98a" : "#f4e7c8";

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <rect width="400" height="400" fill="#f7f3ee" />
      <rect x="24" y="24" width="352" height="352" fill="none" stroke="#e6dccb" />
      <ellipse cx="200" cy="332" rx="92" ry="10" fill="#e7dccd" />
      {category === "bulk" ? (
        <BulkPile seed={n} />
      ) : category === "bar" ? (
        <Bar seed={n} />
      ) : (
        <GiftBox wrap={wrap} accent={accent} ceremonial={category === "occasion"} seed={n} />
      )}
    </svg>
  );
}

function GiftBox({
  wrap,
  accent,
  ceremonial,
  seed,
}: {
  wrap: string;
  accent: string;
  ceremonial: boolean;
  seed: number;
}) {
  const rounds = [0, 1, 2, 3].map((index) => 132 + index * 36);
  return (
    <g>
      <rect x="96" y="176" width="208" height="128" fill={wrap} />
      <polygon points="96,176 304,176 284,148 116,148" fill={wrap} opacity="0.92" />
      <rect x="192" y="148" width="16" height="156" fill={accent} />
      <rect x="96" y="226" width="208" height="14" fill={accent} />
      {ceremonial ? (
        <g>
          <ellipse cx="176" cy="140" rx="30" ry="16" fill={accent} />
          <ellipse cx="224" cy="140" rx="30" ry="16" fill={accent} />
          <circle cx="200" cy="148" r="9" fill="#a6844a" />
        </g>
      ) : null}
      {rounds.map((x, index) => (
        <circle
          key={x}
          cx={x}
          cy={292}
          r="11"
          fill={index % 2 === seed % 2 ? "#2a1a12" : "#c6a15d"}
        />
      ))}
    </g>
  );
}

function BulkPile({ seed }: { seed: number }) {
  const chips = [
    [120, 150],
    [168, 132],
    [214, 158],
    [258, 140],
    [132, 206],
    [186, 198],
    [236, 214],
    [280, 190],
    [154, 258],
    [210, 262],
    [262, 250],
  ];
  return (
    <g>
      {chips.map(([x, y], index) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={index % 3 === 0 ? 34 : 28}
          height="18"
          rx="4"
          transform={`rotate(${(seed + index * 17) % 24 - 12} ${x + 14} ${y + 9})`}
          fill={index % 2 === 0 ? "#3c2a1e" : "#a6844a"}
        />
      ))}
    </g>
  );
}

function Bar({ seed }: { seed: number }) {
  const milk = seed % 2 === 0;
  return (
    <g>
      <rect x="118" y="132" width="164" height="168" rx="6" fill={milk ? "#7a4a2a" : "#2c1c14"} />
      <rect x="132" y="146" width="136" height="140" fill={milk ? "#a86b3c" : "#4a3024"} />
      {[0, 1, 2].map((col) =>
        [0, 1, 2, 3].map((row) => (
          <rect
            key={`${col}-${row}`}
            x={140 + col * 42}
            y={154 + row * 32}
            width="34"
            height="24"
            rx="2"
            fill={milk ? "#c48955" : "#3a241c"}
            stroke={milk ? "#8a5a32" : "#6a4a38"}
          />
        )),
      )}
    </g>
  );
}
