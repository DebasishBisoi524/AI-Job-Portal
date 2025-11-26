import React from "react";

const Footer = () => {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-[#6a3ac2] via-[#7b45d6] to-[#b66bf3] text-white  shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Footer Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-20 text-center md:text-left">
          {/* Branding */}
          <div>
            <h2 className="text-3xl font-extrabold">
              Job<span className="text-gray-100">Hunt</span>
            </h2>
            <p className="text-gray-200 mt-2 max-w-xs">
              Discover your dream career — search, apply, and grow with top
              companies around the world.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            <div>
              <h3 className="font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-gray-200 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Careers
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Contact
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Blog
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Resources</h3>
              <ul className="space-y-2 text-gray-200 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">
                  Help Center
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="text-center md:text-right">
            <h3 className="font-semibold text-white mb-3">Stay Updated</h3>
            <p className="text-gray-200 text-sm mb-4">
              Subscribe to get the latest job alerts and updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 justify-center md:justify-end">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:border-white focus:ring-2 focus:ring-white/50 outline-none text-sm w-full sm:w-auto"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-white text-[#6a3ac2] font-medium hover:bg-gray-100 transition-all text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/30 my-8"></div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-200 text-sm">
          <p>© {new Date().getFullYear()} JobHunt Inc. All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex space-x-5">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
