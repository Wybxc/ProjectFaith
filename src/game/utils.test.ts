import { describe, expect, it } from "vitest";
import {
  faithCost,
  totalFaith,
  minFaithReduce,
  minFaith,
  canAfford,
} from "./utils";
import type { Card } from "./types";

describe("utils", () => {
  describe("faithCost", () => {
    it("should calculate faith cost for a card", () => {
      const card: Card = {
        id: "test",
        name: "测试卡牌",
        description: "测试卡牌",
        collection: "中立",
        subtype: {
          type: "角色",
          cost: ["正义", "元素", "任意"],
          rarity: 0,
        },
      };

      expect(faithCost(card)).toEqual({
        正义: 1,
        元素: 1,
        自然: 0,
        任意: 1,
      });
    });
  });

  describe("totalFaith", () => {
    it("should calculate total faith count", () => {
      const faith = {
        正义: 2,
        元素: 1,
        自然: 0,
        任意: 1,
      };

      expect(totalFaith(faith)).toBe(4);
    });
  });

  describe("minFaithReduce", () => {
    it("should calculate minimum faith required", () => {
      const faith = {
        正义: 1,
        元素: 1,
        自然: 0,
        任意: 0,
      };

      const card: Card = {
        id: "test",
        name: "测试卡牌",
        description: "测试卡牌",
        collection: "中立",
        subtype: {
          type: "角色",
          cost: ["正义", "正义", "任意"],
          rarity: 0,
        },
      };

      expect(minFaithReduce(faith, card)).toEqual({
        正义: 2,
        元素: 1,
        自然: 0,
        任意: 0,
      });
    });
  });

  describe("minFaith", () => {
    it("should calculate minimum faith for multiple cards", () => {
      const cards: Card[] = [
        {
          id: "test1",
          name: "测试卡牌1",
          description: "测试卡牌1",
          collection: "中立",
          subtype: {
            type: "角色",
            cost: ["正义", "元素"],
            rarity: 0,
          },
        },
        {
          id: "test2",
          name: "测试卡牌2",
          description: "测试卡牌2",
          collection: "中立",
          subtype: {
            type: "角色",
            cost: ["正义", "正义", "任意"],
            rarity: 0,
          },
        },
      ];

      expect(minFaith(cards)).toEqual({
        正义: 2,
        元素: 1,
        自然: 0,
        任意: 0,
      });
    });
  });

  describe("canAfford", () => {
    it("should check if faith is sufficient for card cost", () => {
      const faith = {
        正义: 2,
        元素: 1,
        自然: 0,
        任意: 0,
      };

      const affordableCard: Card = {
        id: "test1",
        name: "可购买卡牌",
        description: "可购买卡牌",
        collection: "中立",
        subtype: {
          type: "角色",
          cost: ["正义", "元素", "任意"],
          rarity: 0,
        },
      };

      const unaffordableCard: Card = {
        id: "test2",
        name: "不可购买卡牌",
        description: "不可购买卡牌",
        collection: "中立",
        subtype: {
          type: "角色",
          cost: ["正义", "正义", "正义"],
          rarity: 0,
        },
      };

      expect(canAfford(faith, affordableCard)).toBe(true);
      expect(canAfford(faith, unaffordableCard)).toBe(false);
    });
  });
});
