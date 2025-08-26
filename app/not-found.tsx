import FuzzyText from "@/components/text/fuzzy";

export default function NotFound() {
  return (
    <div className=" flex flex-col justify-center items-center px-3 min-h-screen space-y-4">
      <FuzzyText
        baseIntensity={0.2}
        enableHover
      >
        404
      </FuzzyText>
      <FuzzyText
        baseIntensity={0.1}
        fontSize={40}
        enableHover
      >
        not found
      </FuzzyText>
    </div>
  );
}
