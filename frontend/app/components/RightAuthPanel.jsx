const RightAuthPanel = ({
  title,
  subtitle,
  description,
}) => {
  return (
    <div className="bg-bg-secondary h-screen flex items-center justify-center">
      <div className="w-[520px] bg-bg-primary rounded-2xl px-12 py-14 font-poppins
                      shadow-md border border-border">

        <div className="flex justify-center mb-10">
          <img
            src="/images/loginIllus.png"
            alt="auth"
            className="w-56 drop-shadow-sm"
          />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-text-primary tracking-tight">
            {title}
          </h1>

          <p className="text-secondary font-medium">
            {subtitle}
          </p>

          <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <span className="h-[3px] w-14 rounded-full bg-accent"></span>
        </div>
      </div>
    </div>
  );
};

export default RightAuthPanel;
