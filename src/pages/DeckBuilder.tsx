import { Card as CardUI } from "@/components/ui/Card";
import { cards } from "@/game/card";
import type { Card, Faith } from "@/game/types";
import { useMemo, useState } from "react";
import { Background } from "@/components/ui/Background";

const FAITH_COLORS: Record<Faith, string> = {
  justice: "badge-warning",
  element: "badge-primary",
  nature: "badge-success",
  any: "badge-neutral",
};

const MAX_DECK_SIZE = 30;

export default function DeckBuilder() {
  const [search, setSearch] = useState("");
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<
    "all" | "character" | "action" | "faith"
  >("all");

  const handleAddCard = (card: Card) => {
    if (selectedCards.length < MAX_DECK_SIZE) {
      setSelectedCards((prev) => [...prev, card]);
    }
  };

  const handleRemoveCard = (cardId: string) => {
    setSelectedCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const filteredCards = useMemo(
    () =>
      cards
        .filter(
          (card) =>
            card.name.toLowerCase().includes(search.toLowerCase()) &&
            (filter === "all" || card.subtype.type === filter),
        )
        .sort((a, b) => a.id.localeCompare(b.id)),
    [search, filter],
  );

  const getFaithCost = (faiths: Faith[]) =>
    faiths.map((faith) => (
      <span
        key={faith}
        className={`badge ${FAITH_COLORS[faith]} badge-sm mx-0.5`}
      >
        {faith}
      </span>
    ));

  const groupedSelectedCards = useMemo(() => {
    const grouped: Record<string, { card: Card; count: number }> = {};

    for (const card of selectedCards) {
      if (grouped[card.name]) {
        grouped[card.name].count += 1;
      } else {
        grouped[card.name] = { card, count: 1 };
      }
    }

    return Object.values(grouped).sort((a, b) =>
      a.card.id.localeCompare(b.card.id),
    );
  }, [selectedCards]);

  return (
    <Background className="h-screen">
      <CardUI>
        <div className="grid grid-cols-2 lg:grid-cols-[1fr,360px] gap-3 h-full">
          {/* 左侧卡牌列表 */}
          <div className="flex flex-col h-full">
            <div className="flex flex-col sm:flex-row gap-2 flex-none">
              <input
                type="text"
                placeholder="搜索卡牌..."
                className="input input-bordered w-full bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-200 h-10 min-h-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="select select-bordered w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white h-10 min-h-0 [&>option]:text-base-content"
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
              >
                <option value="all">全部</option>
                <option value="character">角色</option>
                <option value="action">指令</option>
                <option value="faith">信念</option>
              </select>
            </div>

            <div className="flex-1 overflow-auto mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 content-start">
                {filteredCards.map((card) => (
                  <button
                    key={card.id}
                    className="p-3 rounded-lg cursor-pointer bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                    onClick={() => handleAddCard(card)}
                    type="button"
                    tabIndex={0}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold">{card.name}</span>
                      {"cost" in card.subtype && (
                        <div className="flex flex-wrap justify-end">
                          {getFaithCost(card.subtype.cost)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-base-content/70 mt-2">
                      {card.description}
                    </div>
                    <div className="text-xs text-base-content/50 mt-1">
                      {card.subtype.type}
                      {"rarity" in card.subtype && ` - ★${card.subtype.rarity}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧卡组列表 */}
          <div className="flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-2 flex-none">
              <h2 className="text-lg font-bold">当前卡组</h2>
              <span className="badge badge-primary">
                {selectedCards.length}/30
              </span>
            </div>

            <div className="flex-1 overflow-auto border border-base-300 rounded-lg bg-base-200/30 backdrop-blur-sm">
              <div className="space-y-1 p-2">
                {groupedSelectedCards.map(({ card, count }) => (
                  <div
                    key={card.id}
                    className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-2 rounded text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {card.name}{" "}
                        {count > 1 && (
                          <span className="text-primary">x{count}</span>
                        )}
                      </span>
                      {"cost" in card.subtype && (
                        <div className="flex">
                          {getFaithCost(card.subtype.cost)}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => handleRemoveCard(card.id)}
                    >
                      移除
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary w-full mt-2 hover:brightness-110 transition-all duration-200 shadow-lg h-10 text-base min-h-0 flex-none"
            >
              保存卡组
            </button>
          </div>
        </div>
      </CardUI>
    </Background>
  );
}
