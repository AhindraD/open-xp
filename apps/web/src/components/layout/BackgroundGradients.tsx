export function BackgroundGradients() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none bg-[#050507]">
      {/* 1. Overhead Steel Radial Spotlight (Vercel Style) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(161,161,170,0.18),transparent_70%)]" />

      {/* 2. Secondary Cool Steel Ambient Glow */}
      <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-none bg-[radial-gradient(circle,rgba(113,113,122,0.08)_0%,transparent_70%)] blur-2xl" />

      {/* 3. Mechanical Square Grid Matrix Layer */}
      <div className="absolute inset-0 opacity-[0.45] bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_30%,transparent_90%)]" />

      {/* 4. Fine Dense Mechanical Grid Layer */}
      <div className="absolute inset-0 opacity-[0.25] bg-[linear-gradient(to_right,#3f3f46_1px,transparent_1px),linear-gradient(to_bottom,#3f3f46_1px,transparent_1px)] bg-[size:8px_8px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_20%,transparent_75%)]" />

      {/* 5. Mechanical Crosshair / Plus Accent Matrix (SVG) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_40%,transparent_85%)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="mech-crosshairs" width="160" height="160" patternUnits="userSpaceOnUse">
            {/* Center crosshair */}
            <path
              d="M 80 75 L 80 85 M 75 80 L 85 80"
              stroke="#a1a1aa"
              strokeWidth="1"
              strokeLinecap="square"
            />
            {/* Top-left corner tick */}
            <path d="M 0 5 L 0 0 L 5 0" stroke="#71717a" strokeWidth="0.8" fill="none" />
            {/* Bottom-right corner tick */}
            <path
              d="M 155 160 L 160 160 L 160 155"
              stroke="#71717a"
              strokeWidth="0.8"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mech-crosshairs)" />
      </svg>

      {/* 6. Hairline Steel Horizon Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050507] via-[#050507]/80 to-transparent" />
    </div>
  )
}
