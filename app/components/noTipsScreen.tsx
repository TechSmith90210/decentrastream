import Image from "next/image";

const NoTipsScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center h-auto bg-background text-foreground">
            {/* SVG Illustration */}
            <Image
                src="/no_tips_received.svg" // Place your Undraw SVG in the public folder
                alt="No Tips Yet"
                width={150}
                height={150}
            />

            {/* Message */}
            <p className="mt-4 text-xs font-semibold text-mutedText font-body">
                You haven&apos;t received any tips yet. Keep sharing great content!
            </p>
        </div>
    );
};

export default NoTipsScreen;
