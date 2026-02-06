import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      filters,
      metrics,
      productSales,
      distributorPerformance,
    } = await req.json();

    const prompt = `
You are a business intelligence analyst.

Analyze the following sales & field activity data and produce:
- Key insights
- Performance trends
- Weak areas
- Clear action items for management

Filters:
${JSON.stringify(filters, null, 2)}

KPIs:
${JSON.stringify(metrics, null, 2)}

Product Sales:
${JSON.stringify(productSales, null, 2)}

Distributor Performance:
${JSON.stringify(distributorPerformance, null, 2)}

Keep it concise and dashboard-friendly.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ THIS ONE WORKS
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    return NextResponse.json({
      summary: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("AI ANALYTICS ERROR:", err);

    return NextResponse.json(
      {
        summary:
          "AI summary is temporarily unavailable. Please try again later.",
        error: "AI_FAILED",
      },
      { status: 200 } // ⬅️ IMPORTANT: don’t break UI
    );
  }
}
