"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { articles, newsItems } from "@/lib/mock-data";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { Card } from "@/components/ui/Card";
import { SkeletonCardGrid, SlowLoadingNotice } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

export function HighlightSection() {
  const t = useTranslations("home.highlights");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const debugEmpty = searchParams.get("debugEmpty") === "1";

  const { status, data, isSlow, retry } = useAsyncData(
    () => ({
      latestArticles: debugEmpty ? [] : articles.slice(0, 3),
      latestNews: debugEmpty ? [] : newsItems.slice(0, 3),
    }),
    [debugEmpty],
  );

  if (status === "loading") {
    return (
      <div>
        <SkeletonCardGrid count={3} />
        {isSlow && <SlowLoadingNotice />}
      </div>
    );
  }

  if (status === "error") {
    throw new Error(t("errorMessage"));
  }

  const hasContent = (data?.latestArticles.length ?? 0) > 0 || (data?.latestNews.length ?? 0) > 0;
  if (!hasContent) {
    return (
      <EmptyState
        variant="no-data"
        title={t("emptyAll.title")}
        description={t("emptyAll.description")}
        actionLabel={tCommon("muatUlang")}
        onAction={retry}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-stone-900">{t("articlesTitle")}</h3>
        {data!.latestArticles.length === 0 ? (
          <EmptyState variant="no-data" title={t("emptyArticles.title")} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {data!.latestArticles.map((a) => (
              <Card
                key={a.id}
                href={`/belajar-kascing/${a.slug}`}
                title={a.title}
                excerpt={a.excerpt}
                meta={formatDate(a.publishedAt)}
                tag={a.category}
                hasImage={a.hasImage}
                imageSrc={a.imageUrl}
                cta={tCommon("lihatDetail")}
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold text-stone-900">{t("newsTitle")}</h3>
        {data!.latestNews.length === 0 ? (
          <EmptyState variant="no-data" title={t("emptyNews.title")} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {data!.latestNews.map((n) => (
              <Card
                key={n.id}
                href={`/berita/${n.slug}`}
                title={n.title}
                excerpt={n.excerpt}
                meta={formatDate(n.publishedAt)}
                tag={n.category}
                hasImage={n.hasImage}
                imageSrc={n.imageUrl}
                cta={tCommon("lihatDetail")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
