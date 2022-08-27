import Navbar from "./Navbar";
import Footer from "./Footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col justify-between">
      <Navbar />
      <main className="min-h-screen flex justify-center">
        <div className={`w-full max-w-screen-2xl mb-auto p-5`}>{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
