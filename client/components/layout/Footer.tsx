import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-center lg:text-left bg-gray-300 text-gray-600">
      <div className="mx-6 py-10 text-center md:text-left">
        <div className="grid grid-cols-12 gap-8">
          <div className="md:col-span-4 col-span-12">
            <h6
              className="
            uppercase
            font-semibold
            mb-4
            flex
            items-center
            justify-center
            md:justify-start
          "
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="cubes"
                className="w-4 mr-3"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z"
                ></path>
              </svg>
              XES Ethereum Extractor
            </h6>
          </div>
          <div className="md:col-span-4 sm:col-span-6 col-span-12">
            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
              Useful links
            </h6>
            <p className="mb-4">
              <a href="" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </p>
            <p className="mb-4">
              <a href="" target="_blank" rel="noopener noreferrer">
                Paper
              </a>
            </p>
          </div>
          <div className="md:col-span-4 sm:col-span-6 col-span-12">
            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
              Contact
            </h6>
            <p className="mb-4">info@example.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
