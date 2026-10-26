import type { ArticleTable as ArticleTableData } from "@/lib/types";

interface ArticleTableProps {
  table: ArticleTableData;
}

/** Renders an article's optional comparison table (e.g. nutrient content by parameter). */
export function ArticleTable({ table }: ArticleTableProps) {
  return (
    <div className="mt-6">
      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="bg-stone-50">
              {table.columns.map((column) => (
                <th key={column} className="border-b border-stone-200 px-4 py-2.5 text-left font-semibold text-stone-700">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 1 ? "bg-stone-50/60" : undefined}>
                <td className="border-b border-stone-100 px-4 py-2.5 font-medium text-stone-800 last:border-b-0">
                  {row.label}
                </td>
                {row.values.map((value, j) => (
                  <td key={j} className="border-b border-stone-100 px-4 py-2.5 text-stone-700 last:border-b-0">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="mt-3 text-sm text-stone-500">{table.note}</p>}
    </div>
  );
}
