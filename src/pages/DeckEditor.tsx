import { cards } from "@/game/cards";
import type { Card, Faith } from "@/game/types";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useDeckStore } from "@/store/deck";
import {
  BiSearch,
  BiFilter,
  BiSave,
  BiEdit,
  BiMinus,
  BiTrash,
  BiX,
  BiCopy,
  BiArrowBack,
} from "react-icons/bi";
import {
  canAfford,
  faithProvide,
  minFaith,
  minFaithReduce,
  totalFaith,
  serializeDeck,
} from "@/game/utils";
import { useTypedParams } from "react-router-typesafe-routes";
import { root } from "@/routes";
import { useNavigate } from "react-router";
import { Title, Subtitle } from "@/components/ui/Typography";
import { CardScrollbar } from "@/components/ui/Scrollbar";
import { GlassPanel, CardHover } from "@/components/ui/Panel";
import { Input, InputSmall, Select } from "@/components/ui/Input";
import { GameButton, IconButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// 简化常量定义
const CONSTANTS = {
  MAX_DECK_SIZE: 27,
  MAX_PREFACE: 1,
  FAITH_CARDS: 3,
  COPY_TIMEOUT: 2000,
} as const;

// 简化信念颜色映射
const FAITH_COLORS: Record<Faith, string> = {
  正义: "badge-warning",
  元素: "badge-primary",
  自然: "badge-success",
  任意: "badge-neutral",
} as const;

// 简化验证逻辑
const validateDeck = (cards: Card[]): string[] => {
  const errors = new Set<string>();

  if (cards.length !== CONSTANTS.MAX_DECK_SIZE) {
    errors.add(`卡组需要${CONSTANTS.MAX_DECK_SIZE}张卡牌`);
  }

  const counts = {
    preface: cards.filter((c) => c.preface).length,
    faith: cards.filter((c) => c.subtype.type === "信念").length,
  };

  if (counts.preface > CONSTANTS.MAX_PREFACE) {
    errors.add(`启言卡牌不能超过${CONSTANTS.MAX_PREFACE}张`);
  }

  if (counts.faith !== CONSTANTS.FAITH_CARDS) {
    errors.add(`需要${CONSTANTS.FAITH_CARDS}张信念牌`);
  }

  const faithProvides = faithProvide(cards);
  for (const card of cards) {
    if (!canAfford(faithProvides, card)) {
      errors.add(`卡牌 ${card.name} 的信念要求不满足`);
    }
  }

  return Array.from(errors);
};

export default function DeckEditor() {
  const { deckName } = useTypedParams(root.deck.edit);
  const navigate = useNavigate();
  const {
    currentDeck,
    setCurrentDeckName,
    addCard,
    removeCard,
    saveDeck,
    renameDeckTo,
  } = useDeckStore();

  // 合并状态
  const [state, setState] = useState({
    search: "",
    filter: "全部" as const,
    isEditingName: false,
    editedName: deckName,
    copySuccess: false,
    errors: [] as string[],
  });

  // 简化计算属性
  const deckStats = useMemo(() => {
    const faithCost = minFaith(currentDeck);
    const availableCards = cards
      .filter((card) => totalFaith(minFaithReduce(faithCost, card)) <= 3)
      .map((c) => c.id);

    return { faithCost, availableCards };
  }, [currentDeck]);

  // 简化卡片操作
  const cardOps = {
    add: useCallback((card: Card) => addCard(card), [addCard]),
    remove: useCallback(
      (id: string, all?: boolean) => removeCard(id, all),
      [removeCard],
    ),
    isAvailable: useCallback(
      (card: Card) => {
        const count = currentDeck.filter((c) => c.name === card.name).length;
        return count < 3 && deckStats.availableCards.includes(card.id);
      },
      [currentDeck, deckStats.availableCards],
    ),
  };

  // 简化卡组操作
  const deckOps = {
    save: useCallback(() => {
      if (state.errors.length === 0) saveDeck();
    }, [state.errors, saveDeck]),

    rename: useCallback(
      (name: string) => {
        if (renameDeckTo(name)) {
          navigate(root.deck.edit.$buildPath({ params: { deckName: name } }), {
            replace: true,
          });
        }
      },
      [renameDeckTo, navigate],
    ),

    copy: useCallback(async () => {
      try {
        await navigator.clipboard.writeText(serializeDeck(currentDeck));
        setState((prev) => ({ ...prev, copySuccess: true }));
        setTimeout(
          () => setState((prev) => ({ ...prev, copySuccess: false })),
          CONSTANTS.COPY_TIMEOUT,
        );
      } catch (err) {
        console.error("Failed to copy deck code:", err);
      }
    }, [currentDeck]),
  };

  // 简化副作用
  useEffect(() => {
    if (deckName) setCurrentDeckName(deckName);
  }, [deckName, setCurrentDeckName]);

  useEffect(() => {
    if (currentDeck?.length) {
      setState((prev) => ({ ...prev, errors: validateDeck(currentDeck) }));
    }
  }, [currentDeck]);

  // 简化过滤逻辑
  const filteredCards = useMemo(
    () =>
      cards
        .filter((card) => {
          const matchName = card.name
            .toLowerCase()
            .includes(state.search.toLowerCase());
          const matchType =
            state.filter === "全部" || card.subtype.type === state.filter;
          return matchName && matchType;
        })
        .sort((a, b) => {
          const aAvail = cardOps.isAvailable(a);
          const bAvail = cardOps.isAvailable(b);
          return aAvail === bAvail ? a.id.localeCompare(b.id) : aAvail ? -1 : 1;
        }),
    [state.search, state.filter, cardOps.isAvailable],
  );

  // 优化分组逻辑
  const groupedSelectedCards = useMemo(() => {
    const grouped = currentDeck.reduce(
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
  }, [currentDeck]);

  const getFaithCost = (faiths: Faith[]) =>
    faiths.map((faith, pos) => (
      <span
        key={pos}
        className={`badge ${FAITH_COLORS[faith]} badge-sm mx-0.5 font-medium`}
      >
        {faith}
      </span>
    ));

  return (
    <>
      <title>{deckName ? `编辑卡组 - ${deckName}` : "新建卡组"}</title>

      <div className="flex h-full gap-3">
        {/* 左侧卡牌列表 */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-none flex-col gap-2 sm:flex-row">
            <IconButton
              onClick={() => navigate(-1)}
              className="lf-start btn-circle btn-sm sm:self-center"
              title="返回"
            >
              <BiArrowBack className="h-4 w-4 landscape:h-5 landscape:w-5" />
            </IconButton>
            <div className="relative w-full">
              <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-200/60" />
              <Input
                type="text"
                placeholder="输入卡牌名称搜索..."
                className="w-full pl-9"
                value={state.search}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <BiFilter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-200/60" />
              <Select
                className="w-full pl-9"
                value={state.filter}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    filter: e.target.value as typeof state.filter,
                  }))
                }
              >
                <option value="全部">全部卡牌</option>
                <option value="角色">仅角色牌</option>
                <option value="指令">仅指令牌</option>
                <option value="信念">仅信念牌</option>
              </Select>
            </div>
          </div>

          <CardScrollbar className="mt-2 min-h-0 flex-1 overflow-auto">
            <div className="grid auto-rows-max grid-cols-3 gap-2 p-2 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCards.map((card) => {
                const hasFaith = deckStats.availableCards.includes(card.id);
                const isUnavailable = !cardOps.isAvailable(card);
                const isAvailable = hasFaith && !isUnavailable;
                return (
                  <CardHover
                    key={card.id}
                    as="button"
                    className={cn(
                      "p-2 landscape:p-3",
                      !isAvailable && "cursor-not-allowed opacity-50",
                    )}
                    onClick={() => isAvailable && cardOps.add(card)}
                    disabled={!isAvailable}
                    title={
                      isUnavailable
                        ? "已达到最大数量限制"
                        : !hasFaith
                          ? "信仰要求不满足"
                          : undefined
                    }
                  >
                    <div className="flex items-start justify-between">
                      <Title className="text-sm">{card.name}</Title>
                      {"cost" in card.subtype && (
                        <div className="flex flex-wrap justify-end">
                          {getFaithCost(card.subtype.cost)}
                        </div>
                      )}
                    </div>
                    <Subtitle className="mt-2 text-xs">
                      {card.description}
                    </Subtitle>
                    <div className="mt-1 text-[10px] text-xs text-slate-200 opacity-75">
                      {card.subtype.type}
                      {"rarity" in card.subtype && ` - ★${card.subtype.rarity}`}
                    </div>
                  </CardHover>
                );
              })}
            </div>
          </CardScrollbar>
        </div>

        {/* 右侧卡组编辑 */}
        <div className="flex min-h-0 w-1/3 flex-col">
          <div className="mb-3 flex flex-none flex-col gap-2">
            <div className="flex items-center justify-between">
              {state.isEditingName ? (
                <div className="flex flex-1 items-center gap-3">
                  <InputSmall
                    type="text"
                    value={state.editedName}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        editedName: e.target.value,
                      }))
                    }
                    placeholder="请输入新的卡组名称"
                  />
                  <GameButton
                    onClick={() => deckOps.rename(state.editedName)}
                    className="btn-sm gap-2"
                  >
                    <BiSave className="h-4 w-4" />
                    确定
                  </GameButton>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Title className="text-lg">{deckName}</Title>
                  <IconButton
                    onClick={() =>
                      setState((prev) => ({ ...prev, isEditingName: true }))
                    }
                    title="编辑卡组名称"
                  >
                    <BiEdit className="h-4 w-4" />
                  </IconButton>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="badge badge-primary" title="卡组数量">
                  {currentDeck.length}/27
                </span>
                <IconButton
                  onClick={deckOps.copy}
                  title={state.copySuccess ? "已复制卡组代码" : "复制卡组代码"}
                  className={state.copySuccess ? "text-success" : ""}
                >
                  <BiCopy className="h-4 w-4" />
                </IconButton>
              </div>
            </div>

            <GlassPanel className="flex items-center justify-between gap-2 p-2">
              <span className="text-xs text-slate-200">信念组成：</span>
              <div className="flex gap-1">
                {(Object.entries(deckStats.faithCost) as [Faith, number][]).map(
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
                {Object.values(deckStats.faithCost).every((v) => v === 0) && (
                  <span className="text-sm text-slate-400">无</span>
                )}
              </div>
            </GlassPanel>
          </div>

          <CardScrollbar className="mb-2 min-h-0 flex-1 overflow-auto landscape:mb-3">
            <GlassPanel className="h-full">
              <div className="space-y-1 p-2">
                {groupedSelectedCards.map(({ card, count }) => (
                  <CardHover
                    key={card.id}
                    className="flex items-center justify-between p-2 text-sm"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <div className="truncate">
                        <span className="font-medium text-slate-100">
                          {card.name}{" "}
                          {count > 1 && (
                            <span className="font-bold text-slate-100">
                              x{count}
                            </span>
                          )}
                        </span>
                      </div>
                      {"cost" in card.subtype && (
                        <div className="flex flex-none">
                          {getFaithCost(card.subtype.cost)}
                        </div>
                      )}
                    </div>
                    <div className="ml-2 flex flex-none gap-2">
                      <IconButton
                        onClick={() => cardOps.remove(card.id)}
                        title="移除一张"
                        className={cn(
                          "text-error transition-colors",
                          "hover:bg-error hover:text-error-content",
                        )}
                      >
                        <BiMinus className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        onClick={() => cardOps.remove(card.id, true)}
                        title="移除全部"
                        className={cn(
                          "text-error transition-colors",
                          "hover:bg-error hover:text-error-content",
                        )}
                      >
                        <BiTrash className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </CardHover>
                ))}
              </div>
            </GlassPanel>
          </CardScrollbar>

          {state.errors.length > 0 && (
            <div
              className={cn(
                "mb-2 rounded-lg landscape:mb-3",
                "border border-error/20 bg-error/10",
                "p-2 landscape:p-3",
              )}
            >
              <div className="mb-2 text-sm font-medium text-error">
                卡组存在以下问题：
              </div>
              <ul className="space-y-1 text-xs landscape:text-sm">
                {state.errors.map((error) => (
                  <li
                    key={error}
                    className="flex items-center gap-2 text-error/90"
                  >
                    <BiX className="h-4 w-4 flex-none" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <GameButton
            onClick={deckOps.save}
            disabled={state.errors.length > 0}
            className={cn("text-sm", state.errors.length > 0 && "btn-disabled")}
          >
            <BiSave className="h-4 w-4 landscape:h-5 landscape:w-5" />
            保存卡组
            {state.errors.length > 0 && (
              <span className="text-xs landscape:text-sm">
                （请先修正错误）
              </span>
            )}
          </GameButton>
        </div>
      </div>
    </>
  );
}
