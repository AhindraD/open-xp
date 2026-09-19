export function BackgroundGradients() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.72_0.19_160_/_0.07),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.65_0.18_200_/_0.05),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-chart-2/5 blur-3xl animate-float"
        style={{ animationDelay: '1.5s' }}
      />
    </div>
  )
}
