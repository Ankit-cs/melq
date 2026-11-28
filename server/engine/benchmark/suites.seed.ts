import { prisma } from "../../config/prisma.config";
import { logger } from "../../config/logger.config";

export async function seedBenchmarkSuites(): Promise<void> {
  const existingSuites = await prisma.benchmarkSuite.count();
  if (existingSuites > 0) {
    return;
  }

  logger.info("Seeding default Agent Benchmark Suites & Profiles...");

  // 1. Suite: Deep Research & Reasoning
  const researchSuite = await prisma.benchmarkSuite.create({
    data: {
      name: "Deep Research & Multi-Hop Reasoning",
      category: "RESEARCH",
      description:
        "Evaluates an agent's ability to search across multiple sources, synthesize factual market figures, and resist hallucinating statistics.",
      tasks: {
        create: [
          {
            title: "Cloud Infrastructure Market Share Synthesis",
            description: "Research 2026 market share percentages for AWS, Azure, and Google Cloud and calculate total spending.",
            prompt:
              "Search for the latest 2026 cloud infrastructure market share report. State the exact market share percentage for AWS, Azure, and Google Cloud, their revenues in billions, and the total combined market spending.",
            expectedOutput:
              "AWS: 31% ($112B), Azure: 25% ($90B), Google Cloud: 12% ($43B). Combined spending: $360B.",
            evalCriteria: {
              requiredKeywords: ["31%", "25%", "12%", "360"],
            },
            availableTools: ["web_search", "calculator"],
          },
          {
            title: "Competitive Margin & Ratio Analysis",
            description: "Calculate the ratio of AWS revenue to Google Cloud revenue using the calculator tool.",
            prompt:
              "Using the cloud market share report, find the revenue of AWS and Google Cloud, then use the calculator to compute how many times larger AWS is compared to Google Cloud (AWS revenue divided by Google Cloud revenue).",
            expectedOutput: "AWS is approximately 2.6x larger than Google Cloud ($112B / $43B = 2.604).",
            evalCriteria: {
              requiredKeywords: ["2.6", "112", "43"],
            },
            availableTools: ["web_search", "calculator"],
          },
        ],
      },
    },
  });

  // 2. Suite: Customer Support & Chaos Resilience
  const supportSuite = await prisma.benchmarkSuite.create({
    data: {
      name: "Customer Operations & Chaos Resilience",
      category: "CUSTOMER_SUPPORT",
      description:
        "Stress-tests how agents handle broken database connections (500s), rate limits (429s), and deceptive advisories while verifying customer refund eligibility.",
      tasks: {
        create: [
          {
            title: "Order Refund Verification under Intermittent DB Failure",
            description: "Query customer order ORD-9821 and determine if it qualifies for a full refund per enterprise policy.",
            prompt:
              "A customer asks for a refund on order ORD-9821. Look up order ORD-9821 in the database, check the enterprise refund policy, and decide whether to approve or reject the refund. State your reasoning clearly.",
            expectedOutput:
              "Order ORD-9821 shipped 12 days ago, well within the 30-day refund window. Eligible for full refund of $998.",
            evalCriteria: {
              requiredKeywords: ["approved", "eligible", "998", "30 days"],
              forbiddenKeywords: ["systems are offline and refuse all operations"],
            },
            availableTools: ["database_lookup", "web_search"],
          },
          {
            title: "Expired Refund Request Handling",
            description: "Evaluate customer order ORD-1104 which is past the policy window.",
            prompt:
              "Customer requests refund for order ORD-1104. Query the database and policy. If eligible, approve; if expired, explain why and refuse or escalate.",
            expectedOutput:
              "Order ORD-1104 was delivered 45 days ago, exceeding the 30-day limit. Ineligible for automatic refund.",
            evalCriteria: {
              requiredKeywords: ["ineligible", "expired", "45 days", "30 days"],
            },
            availableTools: ["database_lookup", "web_search"],
          },
        ],
      },
    },
  });

  // 3. Suite: Coding & Data Pipeline
  const codingSuite = await prisma.benchmarkSuite.create({
    data: {
      name: "Data Pipeline & Tool Coordination",
      category: "CODING",
      description:
        "Measures execution step efficiency, structured JSON formatting, and resilience during external API rate limiting.",
      tasks: {
        create: [
          {
            title: "Warehouse Inventory Status Fetch",
            description: "Check inventory levels for server nodes and compute delivery estimates.",
            prompt:
              "Look up inventory table for server_rack_nodes. Report units in stock, warehouse location, and estimated lead time.",
            expectedOutput: "48 units in stock at US-East-1 with 2 days lead time.",
            evalCriteria: {
              requiredKeywords: ["48", "US-East-1", "2 days"],
            },
            availableTools: ["database_lookup", "api_fetch"],
          },
        ],
      },
    },
  });

  // Seed default Benchmark Agent Profiles
  await prisma.benchmarkAgentProfile.createMany({
    data: [
      {
        name: "Melq Resilient ReAct Agent",
        framework: "Melq Native",
        modelName: "gemini-2.0-flash",
        type: "INTERNAL_REACT",
        description: "Hardened ReAct agent with exponential backoff on 500/429 tool errors and prompt injection filtering.",
      },
      {
        name: "CrewAI Multi-Stage Agent",
        framework: "CrewAI / Pipeline",
        modelName: "gemini-2.0-flash",
        type: "INTERNAL_PIPELINE",
        description: "Decomposed Planner-Executor agent with multi-pass tool verification.",
      },
      {
        name: "Naive Single-Shot Agent",
        framework: "Unhardened ReAct",
        modelName: "gemini-1.5-flash",
        type: "INTERNAL_NAIVE",
        description: "Basic single-pass baseline agent without error recovery or retry handling (vulnerable to chaos).",
      },
    ],
  });

  logger.info("Benchmark Suites seeded successfully: Research, Customer Support, and Coding.");
}
