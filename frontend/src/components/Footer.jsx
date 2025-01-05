import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-10 px-4 md:px-16 bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row items-center justify-between gap-6">
      <span className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-200 text-center">
        &copy; {year} | All Rights Reserved
      </span>
      <div className="flex items-center gap-6">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          aria-label="Facebook"
        >
          <BsFacebook />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-300"
          aria-label="Instagram"
        >
          <BsInstagram />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300"
          aria-label="LinkedIn"
        >
          <BsLinkedin />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-200 transition-colors duration-300"
          aria-label="Twitter"
        >
          <BsTwitter />
        </a>
      </div>
    </footer>
  );
}
