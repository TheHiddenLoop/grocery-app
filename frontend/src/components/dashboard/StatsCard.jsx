export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
}) {
  return (
    <div className="glass rounded-xl p-6 animate-fade-in hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>

          {change && (
            <p
              className={`text-sm mt-2 font-medium ${
                changeType === "positive"
                  ? "text-success"
                  : changeType === "negative"
                  ? "text-error"
                  : "text-muted-foreground"
              }`}
            >
              {change}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-xl bg-primary/10 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
