import { Card as CardUI } from "@/components/ui/Card";
import { cards } from "@/game/cards";
import type { Card, Faith } from "@/game/types";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Background } from "@/components/ui/Background";
import { Router } from "@/routes";
import {
  BiSearch,
  BiFilter,
  BiSave,
  BiEdit,
  BiMinus,
  BiTrash,
  BiX,
  BiCopy, // 添加复制图标
  BiArrowBack, // 添加返回图标
} from "react-icons/bi";
import {
  canAfford,
  faithProvide,
  minFaith,
  minFaithReduce,
  totalFaith,
  serializeDeck, // 添加序列化函数
  deserializeDeck, // 添加反序列化函数
} from "@/game/utils";

const FAITH_COLORS: Record<Faith, string> = {
  正义: "badge-warning text-warning-content",
  元素: "badge-primary text-primary-content",
  自然: "badge-success text-success-content",
  任意: "badge-neutral text-neutral-content",
};

const getFaithId = (cardId: string, faith: Faith, position: number) =>
  `${cardId}-${faith}-pos${position}`;

// 修改本地存储操作使用序列化
const deckStorage = {
  get: (name: string) => {
    try {
      const data = localStorage.getItem(`deck:${name}`);
      return data ? deserializeDeck(data) : null;
    } catch (e) {
      console.error("Failed to load deck:", e);
      return null;
    }
  },
  save: (name: string, cards: Card[]) => {
    try {
      localStorage.setItem(`deck:${name}`, serializeDeck(cards));
      return true;
    } catch (e) {
      console.error("Failed to save deck:", e);
      return false;
    }
  },
  remove: (name: string) => {
    localStorage.removeItem(`deck:${name}`);
  },
};

// 添加卡组验证函数
const validateDeck = (cards: Card[]) => {
  const errors: string[] = [];

  // 需要有27张卡牌
  if (cards.length !== 27) {
    errors.push("卡组数量不足");
  }

  // 启言不能超过1张
  const prefaceCount = cards.filter((card) => card.preface).length;
  if (prefaceCount > 1) {
    errors.push("启言卡牌多于1张");
  }

  // 需要有三张信念牌
  const faithCards = cards.filter((card) => card.subtype.type === "信念");
  if (faithCards.length !== 3) {
    errors.push("需要三张信念牌");
  }

  // 卡牌费用需要被信念牌覆盖
  const faithProvides = faithProvide(cards);
  for (const card of cards) {
    if (!canAfford(faithProvides, card)) {
      errors.push(`卡牌 ${card.name} 的信念要求不满足`);
    }
  }

  return Array.from(new Set(errors));
};

export default function DeckEditor({ deckName }: { deckName: string }) {
  const [search, setSearch] = useState("");
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<"全部" | "角色" | "指令" | "信念">(
    "全部",
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(deckName || "");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false); // 添加复制成功状态

  const deckFaithCost = useMemo(() => minFaith(selectedCards), [selectedCards]);
  const availableCardIds = useMemo(
    () =>
      cards
        .filter((card) => totalFaith(minFaithReduce(deckFaithCost, card)) <= 3)
        .map((card) => card.id),
    [deckFaithCost],
  );

  // 优化useEffect依赖
  useEffect(() => {
    if (!deckName) {
      Router.push("MainMenu");
      return;
    }

    const deck = deckStorage.get(deckName);
    if (deck) {
      setSelectedCards(deck);
    }
  }, [deckName]);

  // 更新验证状态
  useEffect(() => {
    const errors = validateDeck(selectedCards);
    setValidationErrors(errors);
  }, [selectedCards]);

  // 优化添加卡牌逻辑
  const handleAddCard = useCallback((card: Card) => {
    setSelectedCards((prev) => {
      if (prev.length >= 27) return prev;

      // 检查同名卡牌数量
      const sameNameCount = prev.filter((c) => c.name === card.name).length;
      if (sameNameCount >= 3) return prev;

      return [...prev, card];
    });
  }, []);

  // 优化移除卡牌逻辑
  const handleRemoveCard = useCallback((cardId: string, removeAll = false) => {
    setSelectedCards((prev) => {
      const cardToRemove = prev.find((card) => card.id === cardId);
      if (!cardToRemove) return prev;

      return removeAll
        ? prev.filter((card) => card.name !== cardToRemove.name)
        : prev.filter(
            (_, index) =>
              index !== prev.findIndex((card) => card.id === cardId),
          );
    });
  }, []);

  // 添加检查卡牌是否达到上限的函数
  const isCardUnavailable = useCallback(
    (card: Card) => {
      const sameNameCount = selectedCards.filter(
        (c) => c.name === card.name,
      ).length;
      return sameNameCount >= 3;
    },
    [selectedCards],
  );

  // 优化过滤逻辑
  const filteredCards = useMemo(
    () =>
      cards
        .filter((card) => {
          const nameMatch = card.name
            .toLowerCase()
            .includes(search.toLowerCase());
          const typeMatch = filter === "全部" || card.subtype.type === filter;
          return nameMatch && typeMatch;
        })
        .sort((a, b) => {
          // 检查卡牌是否可用
          const aUnavailable = isCardUnavailable(a);
          const bUnavailable = isCardUnavailable(b);
          if (aUnavailable !== bUnavailable) {
            return aUnavailable ? 1 : -1;
          }
          // 再按信仰需求排序
          const aHasFaith = availableCardIds.includes(a.id);
          const bHasFaith = availableCardIds.includes(b.id);
          if (aHasFaith !== bHasFaith) {
            return aHasFaith ? -1 : 1;
          }
          return a.id.localeCompare(b.id);
        }),
    [search, filter, availableCardIds, isCardUnavailable],
  );

  // 优化分组逻辑
  const groupedSelectedCards = useMemo(() => {
    const grouped = selectedCards.reduce(
      (acc, card) => {
        if (!acc[card.name]) {
          acc[card.name] = { card, count: 0 };
        }
        acc[card.name].count += 1;
        return acc;
      },
      {} as Record<string, { card: Card; count: number }>,
    );

    return Object.values(grouped).sort((a, b) =>
      a.card.id.localeCompare(b.card.id),
    );
  }, [selectedCards]);

  // 优化保存逻辑
  const handleSaveDeck = useCallback(() => {
    if (!deckName) return;

    const errors = validateDeck(selectedCards);
    if (errors.length > 0) {
      return; // 如果有错误，阻止保存
    }

    if (!deckStorage.save(deckName, selectedCards)) {
      console.error("保存失败");
    }
  }, [deckName, selectedCards]);

  // 优化重命名逻辑
  const handleSaveDeckName = useCallback(() => {
    const newName = editedName.trim();
    if (!newName || newName === deckName) {
      setIsEditingName(false);
      return;
    }

    if (deckName) {
      const deck = deckStorage.get(deckName);
      if (deck) {
        deckStorage.save(newName, deck);
        deckStorage.remove(deckName);
      }
    }

    Router.replace("DeckEditor", { deckName: newName });
    setIsEditingName(false);
  }, [deckName, editedName]);

  // 添加复制卡组代码的函数
  const handleCopyDeck = useCallback(async () => {
    const deckCode = serializeDeck(selectedCards);
    try {
      await navigator.clipboard.writeText(deckCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // 2秒后隐藏提示
    } catch (err) {
      console.error("Failed to copy deck code:", err);
    }
  }, [selectedCards]);

  const getFaithCost = (faiths: Faith[], cardId: string) =>
    faiths.map((faith, pos) => (
      <span
        key={getFaithId(cardId, faith, pos)}
        className={`badge ${FAITH_COLORS[faith]} badge-sm mx-0.5 font-medium`}
      >
        {faith}
      </span>
    ));

  return (
    <Background>
      <title>{deckName ? `编辑卡组 - ${deckName}` : "新建卡组"}</title>
      <CardUI variant="fill">
        <div className="flex h-full gap-3">
          {/* 左侧卡牌列表 */}
          <div className="flex flex-col min-h-0 basis-3/4 lg:basis-2/3 xl:basis-3/4">
            {/* 搜索和筛选区域 */}
            <div className="flex flex-col sm:flex-row gap-2 flex-none">
              <button
                type="button"
                onClick={() => Router.push("Decks")}
                className="btn-icon btn-circle btn-lg lf-start sm:self-center"
                title="返回主菜单"
              >
                <BiArrowBack className="w-5 h-5" />
              </button>
              <div className="relative w-full">
                <BiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-200/60" />
                <input
                  type="text"
                  placeholder="输入卡牌名称搜索..."
                  className="input-primary w-full pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <BiFilter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-200/60" />
                <select
                  className="select-primary w-full pl-9"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                >
                  <option value="全部">全部卡牌</option>
                  <option value="角色">仅角色牌</option>
                  <option value="指令">仅指令牌</option>
                  <option value="信念">仅信念牌</option>
                </select>
              </div>
            </div>

            {/* 卡牌列表区域 */}
            <div className="flex-1 overflow-auto mt-2 min-h-0 scrollbar-card">
              <div className="grid auto-rows-max grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 p-2">
                {filteredCards.map((card) => {
                  const hasFaith = availableCardIds.includes(card.id);
                  const isUnavailable = isCardUnavailable(card);
                  const isAvailable = hasFaith && !isUnavailable;
                  return (
                    <button
                      key={card.id}
                      className={`p-3 cursor-pointer transition-opacity ${
                        isAvailable
                          ? "card-hover"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => isAvailable && handleAddCard(card)}
                      type="button"
                      tabIndex={isAvailable ? 0 : -1}
                      disabled={!isAvailable}
                      title={
                        isUnavailable
                          ? "已达到最大数量限制"
                          : !hasFaith
                            ? "信仰要求不满足"
                            : undefined
                      }
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-title text-slate-100 font-medium">
                          {card.name}
                        </span>
                        {"cost" in card.subtype && (
                          <div className="flex flex-wrap justify-end">
                            {getFaithCost(card.subtype.cost, card.id)}
                          </div>
                        )}
                      </div>
                      <div className="text-subtitle text-sm mt-2 text-slate-200 opacity-90">
                        {card.description}
                      </div>
                      <div className="text-xs text-slate-200 opacity-75 mt-1">
                        {card.subtype.type}
                        {"rarity" in card.subtype &&
                          ` - ★${card.subtype.rarity}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右侧卡组列表 */}
          <div className="flex flex-col min-h-0 basis-1/4 lg:basis-1/3 xl:basis-1/4">
            <div className="flex flex-col gap-3 mb-4 flex-none">
              <div className="flex justify-between items-center">
                {isEditingName ? (
                  <div className="flex gap-3 items-center flex-1">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="input-sm-primary w-full"
                      placeholder="请输入新的卡组名称"
                    />
                    <button
                      onClick={handleSaveDeckName}
                      className="btn btn-primary btn-sm gap-2"
                      type="button"
                    >
                      <BiSave className="w-4 h-4" />
                      确定
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-100">
                      {deckName}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="btn-icon"
                      type="button"
                      title="编辑卡组名称"
                    >
                      <BiEdit className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary" title="卡组数量">
                    {selectedCards.length}/27
                  </span>
                  <button
                    type="button"
                    className={`btn-icon ${copySuccess ? "text-success" : ""}`}
                    onClick={handleCopyDeck}
                    title={copySuccess ? "已复制卡组代码" : "复制卡组代码"}
                  >
                    <BiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 添加信仰消耗显示 */}
              <div className="flex items-center justify-between gap-2 p-2 glass-panel rounded-lg">
                <span className="text-sm text-slate-200">信念组成：</span>
                <div className="flex gap-1">
                  {(Object.entries(deckFaithCost) as [Faith, number][]).map(
                    ([faith, cost]) =>
                      cost > 0 && (
                        <span
                          key={faith}
                          className={`badge ${FAITH_COLORS[faith]} badge-sm font-medium`}
                        >
                          {faith} x{cost}
                        </span>
                      ),
                  )}
                  {Object.values(deckFaithCost).every((v) => v === 0) && (
                    <span className="text-sm text-slate-400">无</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto min-h-0 glass-panel mb-4 rounded-lg scrollbar-card">
              <div className="space-y-1 p-2">
                {groupedSelectedCards.map(({ card, count }) => (
                  <div
                    key={card.id}
                    className="flex justify-between items-center p-2 text-sm card-hover rounded"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="truncate">
                        <span className="font-medium text-slate-100">
                          {card.name}{" "}
                          {count > 1 && (
                            <span className="text-slate-100 font-bold">
                              x{count}
                            </span>
                          )}
                        </span>
                      </div>
                      {"cost" in card.subtype && (
                        <div className="flex flex-none">
                          {getFaithCost(card.subtype.cost, card.id)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-none ml-2">
                      <button
                        type="button"
                        className="btn-icon text-error hover:bg-error hover:text-error-content transition-colors"
                        onClick={() => handleRemoveCard(card.id)}
                        title="移除一张"
                      >
                        <BiMinus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="btn-icon text-error hover:bg-error hover:text-error-content transition-colors"
                        onClick={() => handleRemoveCard(card.id, true)}
                        title="移除全部"
                      >
                        <BiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 添加验证错误提示 */}
            {validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                <div className="text-error font-medium mb-2">
                  卡组存在以下问题：
                </div>
                <ul className="text-sm space-y-1">
                  {validationErrors.map((error) => (
                    <li
                      key={error}
                      className="flex items-center gap-2 text-error/90"
                    >
                      <BiX className="flex-none w-4 h-4" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              className={`btn-game gap-2 ${validationErrors.length > 0 ? "btn-disabled" : ""}`}
              onClick={handleSaveDeck}
              disabled={validationErrors.length > 0}
            >
              <BiSave className="w-5 h-5" />
              保存卡组
              {validationErrors.length > 0 && (
                <span className="text-sm">（请先修正错误）</span>
              )}
            </button>
          </div>
        </div>
      </CardUI>
    </Background>
  );
}
