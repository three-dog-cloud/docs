import styles from "@/components/HomepageHero/SetupHero.module.scss";
import { useLocale } from "@/hooks";
import { MotionWrapperFlash } from "../MotionWrapper";
import { FlipWords } from "../ui/flip-words";
import { Button } from "../ui/button";
import Link from "next/link";

interface Props {}

export function SetupHero(props: Props) {
  const { t, currentLocale } = useLocale();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.badgeContainer}>
          <span className={styles.badge}>{t("badgeTitle")}</span>
        </div>
        <h1 className={styles.headline}>
          <MotionWrapperFlash className="flex items-center">
            <span className="icon-[emojione-v1--lightning-mood]"></span>
          </MotionWrapperFlash>{" "}
          Three <br className="sm:hidden"></br> Dog's
          <br className="sm:hidden"></br> Docs
        </h1>
        <div className={styles.subtitle}>
          {t("homeTitle.title")} <FlipWords words={t("homeTitle.words")} />{" "}
        </div>
        <div className="flex justify-center pt-10">
          <div className="max-w-[500px] flex flex-wrap gap-[20px] max-sm:justify-center">
            <Button
              asChild
              size="lg"
              className="font-bold group max-sm:w-[100%]"
            >
              <Link href={`/${currentLocale}/welcome`}>
                Get Started
                <span className="w-[20px] translate-x-[6px] transition-all group-hover:translate-x-[10px] icon-[mingcute--arrow-right-fill]"></span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
