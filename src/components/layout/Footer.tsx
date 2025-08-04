import {
  TrendingUp,
  Github,
  Linkedin,
  Mail,
  ArrowUp,
  MapPin,
  Phone,
  Send,
  ExternalLink,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      icon: <Github size={20} />,
      href: "https://github.com/pkr-9",
      label: "GitHub",
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://www.linkedin.com/in/p-kr9/",
      label: "LinkedIn",
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:pappukumar9999@yahoo.com",
      label: "Email",
    },
  ];

  const quickLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Transactions", path: "/transactions" },
    { label: "Budgets", path: "/budgets" },
    { label: "Reports", path: "/reports" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white overflow-hidden mt-auto">
      {/* Background decoration blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-20 left-1/2 w-60 h-60 bg-gradient-to-r from-emerald-300/10 to-teal-300/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                FinanceTracker
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your comprehensive financial companion. Track expenses, manage
              budgets, and achieve your financial goals with powerful insights
              and analytics.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="flex items-center text-slate-300 hover:text-emerald-400 transition-colors duration-200 group"
                  >
                    <ExternalLink
                      size={14}
                      className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-emerald-400 flex-shrink-0" />
                <span className="text-sm">New Delhi, Delhi, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-emerald-400 flex-shrink-0" />
                <span className="text-sm">+91 9504860538</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-emerald-400 flex-shrink-0" />
                <span className="text-sm">pappukumar9999@yahoo.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
            <p className="text-slate-300 text-sm">
              Get the latest updates about new features and financial tips.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-400"
              />
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium">
                <Send size={16} className="mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} FinanceTracker</span>
            <span>for better financial health</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}
