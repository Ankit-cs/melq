/**
 * Mock Tools implementation for the Agent Benchmarking Platform.
 * Provides realistic responses for agent tool use during benchmark tasks.
 */

export interface MockToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface MockToolResult {
  toolName: string;
  result: unknown;
  isError?: boolean;
}

export const MOCK_KNOWLEDGE_BASE: Record<string, unknown> = {
  "cloud_market_share": {
    year: 2026,
    providers: [
      { name: "AWS", sharePercentage: 31, revenueBillions: 112 },
      { name: "Azure", sharePercentage: 25, revenueBillions: 90 },
      { name: "Google Cloud", sharePercentage: 12, revenueBillions: 43 },
      { name: "Others", sharePercentage: 32, revenueBillions: 115 },
    ],
  },
  "customer_orders": {
    "ORD-9821": {
      orderId: "ORD-9821",
      customerId: "CUST-402",
      status: "SHIPPED",
      items: [{ sku: "AI-ACCEL-V2", qty: 2, price: 499 }],
      total: 998,
      eligibleForRefund: true,
      refundPolicyDays: 30,
      daysSinceOrder: 12,
    },
    "ORD-1104": {
      orderId: "ORD-1104",
      customerId: "CUST-809",
      status: "DELIVERED",
      items: [{ sku: "EDGE-ROUTER-PRO", qty: 1, price: 1250 }],
      total: 1250,
      eligibleForRefund: false,
      refundPolicyDays: 30,
      daysSinceOrder: 45,
    },
  },
  "api_inventory": {
    "server_rack_nodes": { inStock: 48, warehouse: "US-East-1", leadTimeDays: 2 },
    "quantum_tpu_v5": { inStock: 0, warehouse: "US-Central", leadTimeDays: 21 },
  },
};

export async function executeMockTool(
  name: string,
  args: Record<string, unknown>,
): Promise<MockToolResult> {
  switch (name) {
    case "web_search": {
      const query = String(args.query || "").toLowerCase();
      if (query.includes("market") || query.includes("share") || query.includes("cloud")) {
        return {
          toolName: name,
          result: {
            title: "Global Cloud Infrastructure Market Report 2026",
            snippet:
              "AWS holds 31% market share ($112B), Azure holds 25% ($90B), Google Cloud grew to 12% ($43B). Combined cloud spending reached $360B.",
            url: "https://cloud-analytics.example.com/2026-market-share",
          },
        };
      }
      if (query.includes("refund") || query.includes("policy")) {
        return {
          toolName: name,
          result: {
            title: "Standard Enterprise Customer Refund Policy",
            snippet:
              "Customers may request full refunds within 30 days of shipment for active orders. Orders past 30 days require managerial approval.",
            url: "https://support.example.com/refund-policy",
          },
        };
      }
      return {
        toolName: name,
        result: {
          title: `Search results for: ${query}`,
          snippet: `Found 3 verified technical reports matching "${query}". No critical alerts detected.`,
          url: "https://search.example.com",
        },
      };
    }

    case "database_lookup": {
      const table = String(args.table || "");
      const key = String(args.key || "");
      const data = MOCK_KNOWLEDGE_BASE[table] as Record<string, unknown> | undefined;
      if (data && data[key]) {
        return { toolName: name, result: data[key] };
      }
      if (data) {
        return { toolName: name, result: data };
      }
      return { toolName: name, result: { error: "Record not found", table, key }, isError: true };
    }

    case "calculator": {
      const expr = String(args.expression || "0");
      try {
        // Safe evaluation for basic math
        const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, "");
        const evalResult = Function(`"use strict"; return (${sanitized})`)();
        return { toolName: name, result: { expression: expr, result: evalResult } };
      } catch (err) {
        return { toolName: name, result: { error: "Invalid math expression", expression: expr }, isError: true };
      }
    }

    case "api_fetch": {
      const endpoint = String(args.endpoint || "");
      return {
        toolName: name,
        result: {
          status: 200,
          endpoint,
          data: { ping: "pong", timestamp: new Date().toISOString(), healthy: true },
        },
      };
    }

    default:
      return {
        toolName: name,
        result: { error: `Unknown tool: ${name}` },
        isError: true,
      };
  }
}
