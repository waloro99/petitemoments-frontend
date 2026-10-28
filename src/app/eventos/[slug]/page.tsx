import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingSkeleton, landingMetadata, landingStaticParams, LandingView } from "@/components/landing/LandingView";

export function generateStaticParams() {
  return landingStaticParams("eventos");
}

export async function generateMetadata({ params }: PageProps<"/eventos/[slug]">): Promise<Metadata> {
  return landingMetadata("eventos", (await params).slug);
}

export default function Page({ params }: PageProps<"/eventos/[slug]">) {
  return (
    <main className="pm-container max-w-[1240px] pb-10 pt-[34px]">
      <Suspense fallback={<LandingSkeleton />}>
        <Content params={params} />
      </Suspense>
    </main>
  );
}

async function Content({ params }: { params: PageProps<"/eventos/[slug]">["params"] }) {
  const { slug } = await params;
  return <LandingView kind="eventos" slug={slug} />;
}
