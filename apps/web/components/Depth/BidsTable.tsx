"use client";

import { useMemo } from "react";

interface BidsTableProps {
  bids: [string, string][];
}

const BidsTable = ({ bids }: BidsTableProps) => {
  const visibleBids = useMemo(() => {
    let cumulative = 0;

    return bids
      .slice(0, 9)
      .map(([price, quantity]) => {
        cumulative += Number(quantity);

        return {
          price,
          quantity,
          total: cumulative,
        };
      });
  }, [bids]);

  const maxQuantity = Math.max(
    ...visibleBids.map((row) =>
      Number(row.quantity)
    ),
    1
  );

  return (
    <div className="flex shrink-0 flex-col overflow-hidden">
      {visibleBids.map((row) => {
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

            {/* Green depth background */}

            <div
              className="
                absolute
                inset-y-0
                right-0
                bg-emerald-500/[0.13]
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
                text-emerald-400
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

export default BidsTable;