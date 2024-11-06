import Link from "next/link";
import { PAPER_DOI_URL } from "../../const/url";

const Footer = () => {
  return (
    <footer className="bg-gray-200 shadow-md flex justify-center">
      <div className="w-full max-w-7xl text-center lg:text-left">
        <div className="mx-6 py-10 text-center md:text-left">
          <div className="grid grid-cols-12 gap-y-2">
            <div className="md:col-span-4 col-span-12">
              <h6 className="uppercase font-semibold mb-4 flex items-center justify-center md:justify-start">EveLog</h6>
            </div>
            <div className="md:col-span-4 sm:col-span-6 col-span-12">
              <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">Useful links</h6>
              <p className="mb-4">
                <a
                  href="https://github.com/yuripaoloni/xes-ethereum-extractor"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </p>
              <p className="mb-4">
                <a href={PAPER_DOI_URL}>Paper</a>
              </p>
            </div>
            <div className="md:col-span-4 sm:col-span-6 col-span-12">
              <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">Contact</h6>
              <p className="mb-4">
                <a href="mailto:yuri.paoloni3@gmail.com">yuri.paoloni3@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
