"use client";

import { useMemo } from "react";

interface AskTableProps {
  asks: [string, string][];
}

const AskTable = ({ asks }: AskTableProps) => {
  const visibleAsks = useMemo(() => {
    let cumulative = 0;

    const rows = asks
      .slice(0, 9)
      .map(([price, quantity]) => {
        cumulative += Number(quantity);

        return {
          price,
          quantity,
          total: cumulative,
        };
      });

    // Best ask should be closest
    // to the center price
    return rows.reverse();
  }, [asks]);

  const maxQuantity = Math.max(
    ...visibleAsks.map((row) =>
      Number(row.quantity)
    ),
    1
  );

  return (
    <div className="flex shrink-0 flex-col overflow-hidden">
      {visibleAsks.map((row) => {
        const percentage = Math.min(
          (Number(row.quantity) / maxQuantity) * 100,
          100
        );

        return (
          <div
            key={row.price}
            className="
              relative
              grid
              h-7
              shrink-0
              grid-cols-3
              items-center
              overflow-hidden
              px-4
              text-xs
            "
          >

            {/* Red depth background */}

            <div
              className="
                absolute
                inset-y-0
                right-0
                bg-red-500/[0.13]
              "
              style={{
                width: `${percentage}%`,
              }}
            />

            <span
              className="
                relative
                z-10
                font-medium
                text-red-400
              "
            >
              {Number(row.price).toFixed(2)}
            </span>

            <span
              className="
                relative
                z-10
                text-right
                text-zinc-300
              "
            >
              {Number(row.quantity).toFixed(2)}
            </span>

            <span
              className="
                relative
                z-10
                text-right
                text-zinc-400
              "
            >
              {row.total.toFixed(2)}
            </span>

          </div>
        );
      })}
    </div>
  );
};

export default AskTable;