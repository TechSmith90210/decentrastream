import Image from "next/image";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      {/* SVG Illustration */}
      <Image
        src="/loading_image.svg" // Place your Undraw SVG in the public folder
        alt="Loading..."
        width={180}
        height={180}
        className="animate-fade-in"
      />

      {/* Loading Text */}
      <p className="mt-4 text-sm font-semibold text-mutedText animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
};

export default LoadingScreen;
