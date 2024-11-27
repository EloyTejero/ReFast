import { FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 w-full">
      <div className="max-w-screen-xl mx-auto p-4 md:py-8">
        {/* Logo y nombre del servicio */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href=""
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              REFAST
            </span>
          </a>
        </div>

        {/* Sección de información adicional (ubicada arriba de la línea) */}
        <div className="text-center space-y-4 mb-6">
          {/* Horario de atención */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
             Lunes a Viernes de 8:00 AM a 23:00 PM
          </p>

          {/* Enlaces útiles */}
      
          {/* Redes sociales */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
          
            <a href="https://www.instagram.com/buffet_colegio" target="_blank" className="hover:underline ml-2">
              <FaInstagram className="inline-block mr-2" /> Instagram
            </a> | 
            <a href="https://www.facebook.com/share/g/18Xjofz77g/" target="_blank" className="hover:underline ml-2">
              <FaFacebook className="inline-block mr-2" /> Facebook
            </a>
          </div>
        </div>

        {/* Línea de separación */}
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        
        {/* Derechos reservados */}
        <div className="text-center mt-4">
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <a href="" className="hover:underline">
              Refast™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
