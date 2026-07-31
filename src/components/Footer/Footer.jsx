import {
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

import siteConfig from "../../config/siteConfig";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex justify-center gap-8 text-3xl">

          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 duration-300"
          >
            <FaInstagram />
          </a>

          <a
            href={siteConfig.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 duration-300"
          >
            <FaYoutube />
          </a>

          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500 duration-300"
          >
            <FaWhatsapp />
          </a>

          <a
            href={`mailto:${siteConfig.email}`}
            className="hover:text-yellow-400 duration-300"
          >
            <FaEnvelope />
          </a>

        </div>

        <p className="text-center text-slate-400 mt-8">
          © 2019 Collins Classroom. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}