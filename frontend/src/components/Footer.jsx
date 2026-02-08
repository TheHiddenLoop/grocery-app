export default function Footer() {
  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#", label: "Facebook" },
    { icon: "fab fa-instagram", href: "#", label: "Instagram" },
    { icon: "fab fa-twitter", href: "#", label: "Twitter" },
    { icon: "fab fa-youtube", href: "#", label: "Youtube" },
  ];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <footer id="contact" className="bg-bg-secondary border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">

          <div className="flex flex-col sm:flex-row items-center justify-between ">

            <p className="text-text-secondary text-sm text-center sm:text-left">
              © 2026 ApnaMart. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-bg-primary border border-border text-text-secondary hover:bg-primary hover:text-text-primary transition-all hover:scale-110"
                >
                  <i className={`${social.icon} text-base`}></i>
                </a>
              ))}
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}
