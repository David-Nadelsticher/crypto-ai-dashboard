import OnboardingIllustration from "../illustrations/OnboardingIllustration";
import BrandHeader from "./BrandHeader";
import PageLayout from "./PageLayout";

export default function OnboardingLayout({ title, subtitle, overline, intro, children }) {
  return (
    <PageLayout maxWidth="3xl">
      <BrandHeader title={title} subtitle={subtitle} overline={overline} intro={intro} />

      <div className="mb-8 overflow-hidden rounded-card border border-piggy-border bg-piggy-cream shadow-card">
        <OnboardingIllustration className="aspect-[3/2] w-full" />
      </div>

      {children}
    </PageLayout>
  );
}
