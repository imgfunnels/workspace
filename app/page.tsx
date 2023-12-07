import Image from "next/image";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-24">
        <div className="text-stone-500 text-2xl font-medium">
          Work Collection
        </div>
        <div className="my-12 text-6xl font-bold">IMG Workspace</div>
        <div className="grid grid-cols-3 gap-8 my-20">
          <div className="rounded-xl overflow-clip">
            <Image
              alt="Project image placeholder"
              src="https://placehold.co/600x400.png"
              width="600"
              height="400"
            />
          </div>
          <div className="rounded-xl overflow-clip">
            <Image
              alt="Project image placeholder"
              src="https://placehold.co/600x400.png"
              width="600"
              height="400"
            />
          </div>
          <div className="rounded-xl overflow-clip">
            <Image
              alt="Project image placeholder"
              src="https://placehold.co/600x400.png"
              width="600"
              height="400"
            />
          </div>
          <div className="rounded-xl overflow-clip col-span-3">
            <Image
              className="w-full object-contain"
              alt="Project image placeholder"
              src="https://placehold.co/600x400.png"
              width="600"
              height="400"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-28">
          <div className="my-20">
            <h4 className="text-xl font-semibold my-10">Overview</h4>
            <p>
              The IMG Workspace is an open source dashboard that allows you to
              manage multiple GitHub Organizations from a single HighLevel
              agency account.
            </p>
          </div>
          <div className="my-20">
            <h4 className="text-xl font-semibold my-10">Approach</h4>
            <p>
              Our goal is to make it as easy as possible for your agency to
              manage your clients&apos; apps with a dashboard where you can view
              commit history, issues, discussions, PRs, etc. and trace them back
              to users or Sub-Accounts in HighLevel.
            </p>
            <p>
              Manage all of your clients&apos; apps and stay up to date with
              billing from one place.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
