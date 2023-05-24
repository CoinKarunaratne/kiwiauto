import Navbar from "./components/Navbar";
import LargeHeading from "./components/ui/LargeHeading";
import Paragraph from "./components/ui/Paragraph";
import Link from "next/link";
import LandingPageForm from "./components/LandingPageForm";
import Lottie from "./components/LottieComponent";

export default function Home() {
  return (
    <main className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <Navbar />
      <div className="container pt-32 max-w-7xl w-full mx-auto h-full">
        <div className="h-full gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start">
          <LargeHeading
            size="lg"
            className="three-d text-black dark:text-light-gold"
          >
            Kiwi Auto Care <br /> Business App.
          </LargeHeading>

          <Paragraph className="max-w-xl lg:text-left">
            <Link
              href="https://www.kiwiautocare.co.nz/"
              className="underline underline-offset-2 text-black dark:text-light-gold"
            >
              Kiwi Autocare
            </Link>{" "}
            is your ONE STOP solution bringing best car services.
          </Paragraph>
          <LandingPageForm />
          <Lottie />
        </div>
      </div>
    </main>
  );
}
