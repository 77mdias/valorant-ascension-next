import Link from "next/link";
import {
  Github,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
} from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      href: "#",
      label: "Discord",
    },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitch" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Twitter" },
  ];

  const quickLinks = [
    { label: "Cursos", href: "#courses" },
    { label: "Comunidade", href: "#community" },
    { label: "Preços", href: "#pricing" },
    { label: "Contato", href: "#contact" },
  ];

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="bg-gradient-primary bg-clip-text text-2xl font-bold text-transparent">
                NeXT
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Academia de treinamento profissional para Valorant. Evolua seu
              gameplay com os melhores.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="hover:shadow-neon flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-all duration-300 hover:bg-primary/20 hover:text-primary"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground">
              Receba dicas exclusivas e novidades sobre nossos cursos.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 rounded-lg border border-border bg-muted px-4 py-2 transition-colors focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-primary hover:shadow-neon rounded-lg px-6 py-2 font-medium text-primary-foreground transition-all duration-300"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 NeXT Academy. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Termos de Uso
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
