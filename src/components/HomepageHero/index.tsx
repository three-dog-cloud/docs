import { useLocale } from "@/hooks";
import { cn } from "@/lib/utils";
import { PanelParticles } from "../PanelParticles";
import { SetupHero } from "./Setup";

export const StackItem = ({ className }: { className: string }) => {
  return (
    <div
      className={cn(
        "mx-6 size-[50px",
        "text-neutral-800 dark:text-neutral-100",
        className
      )}
    ></div>
  );
};

export default function HomepageHero() {
  const { t } = useLocale();

  return (
    <>
      <PanelParticles />
      <SetupHero />
    </>
  );
}
