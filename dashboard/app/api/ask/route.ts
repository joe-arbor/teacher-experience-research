import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "public", "teacher_experience_data.json");

function loadData(): Array<{
  summary: string;
  comment: string;
  phase: string;
  journeys: string[];
  top_level_category?: string;
  sub_category?: string;
}> {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, contextPhase, contextCategory, contextSubCategory, contextJourney } = body as {
      question?: string;
      contextPhase?: string | null;
      contextCategory?: string | null;
      contextSubCategory?: string | null;
      contextJourney?: string | null;
    };
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing or invalid question" }, { status: 400 });
    }

    const all = loadData();
    let subset = all;
    if (contextPhase) {
      const phases = contextPhase.split(",").map((p: string) => p.trim());
      subset = subset.filter((r) => phases.includes(r.phase || "Both"));
    }
    if (contextCategory) {
      subset = subset.filter((r) => r.top_level_category === contextCategory);
    }
    if (contextSubCategory) {
      subset = subset.filter((r) => r.sub_category === contextSubCategory);
    }
    if (contextJourney) {
      subset = subset.filter((r) => (r.journeys || []).includes(contextJourney));
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        answer:
          "AI answers are disabled. Set OPENAI_API_KEY in .env.local to enable. Use the filters above to explore the feedback.",
      });
    }

    const contextText = subset
      .slice(0, 150)
      .map(
        (r, i) =>
          `[${i + 1}] Summary: ${r.summary || ""}\nComment: ${(r.comment || "").slice(0, 500)}`
      )
      .join("\n\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful analyst. Answer the user's question using ONLY the following teacher experience feedback. If the context does not contain enough information, say so. Be concise.`,
          },
          {
            role: "user",
            content: `Context (feedback excerpts):\n\n${contextText}\n\nQuestion: ${question}`,
          },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `OpenAI API error: ${err}` }, { status: 502 });
    }

    const json = await response.json();
    const answer = json.choices?.[0]?.message?.content ?? "No response.";
    return NextResponse.json({ answer });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
