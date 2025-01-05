import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children,hideNav, hideFooter }) => {
  return (
    <main className="min-h-[100vh] bg-white dark:bg-base-200">

    {!hideNav && <Navbar />}

    {children}

    {!hideFooter && <Footer />}
  </main>
  )
}

export default Layout
