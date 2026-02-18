import { NextRequest, NextResponse } from "next/server";
import { resumeContext } from "@/lib/resumeContext";

type ChatRequest = {
  message?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const provider =
      process.env.AI_PROVIDER ||
      (process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID
        ? "cloudflare"
        : process.env.OLLAMA_BASE_URL
          ? "ollama"
          : "openai");

    if (provider === "cloudflare") {
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
      const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
      const model = (process.env.CLOUDFLARE_MODEL || "@cf/meta/llama-3.1-8b-instruct").trim();
      const normalizedModel = model.replace(/^\/+/, "");
      const hasPlaceholderAccountId =
        !accountId || accountId.includes("REPLACE_WITH") || accountId.includes("your_cloudflare");
      const hasPlaceholderToken =
        !token || token.includes("REPLACE_WITH") || token.includes("your_cloudflare");

      if (hasPlaceholderAccountId || hasPlaceholderToken) {
        return NextResponse.json({
          reply:
            "Cloudflare Workers AI is not fully configured. Replace placeholder values in CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN."
        });
      }

      async function runCloudflare(modelId: string) {
        return fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${modelId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: resumeContext
              },
              {
                role: "user",
                content: message
              }
            ]
          })
        });
      }

      let response = await runCloudflare(normalizedModel);

      if (!response.ok) {
        const firstErrorText = await response.text();
        const isRouteError = firstErrorText.includes("\"code\":7000");
        const shouldFallback = isRouteError && normalizedModel === "@cf/meta/llama-3.1-8b-instruct";

        if (shouldFallback) {
          response = await runCloudflare("@cf/meta/llama-3-8b-instruct");
        } else {
          return NextResponse.json(
            {
              error: `Cloudflare Workers AI request failed with status ${response.status}`,
              detail: firstErrorText,
              debug: {
                accountIdSuffix: accountId.slice(-6),
                model: normalizedModel
              }
            },
            { status: 502 }
          );
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          {
            error: `Cloudflare Workers AI request failed with status ${response.status}`,
            detail: errorText,
            debug: {
              accountIdSuffix: accountId.slice(-6),
              model: normalizedModel
            }
          },
          { status: 502 }
        );
      }

      const data = (await response.json()) as {
        result?: {
          response?: string;
          output_text?: string;
        };
      };

      return NextResponse.json({
        reply:
          data.result?.response ||
          data.result?.output_text ||
          "I could not generate a response. Please try again."
      });
    }

    if (provider === "ollama") {
      const baseUrl = process.env.OLLAMA_BASE_URL;
      const model = process.env.OLLAMA_MODEL || "llama3.1:8b";

      if (!baseUrl) {
        return NextResponse.json({
          reply:
            "OLLAMA_BASE_URL is missing. For Vercel deployment, point this to a publicly reachable Ollama server."
        });
      }

      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [
            {
              role: "system",
              content: resumeContext
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          {
            error: `Ollama request failed with status ${response.status}`,
            detail: errorText
          },
          { status: 502 }
        );
      }

      const data = (await response.json()) as {
        message?: { content?: string };
      };

      return NextResponse.json({
        reply: data.message?.content || "I could not generate a response. Please try again."
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply:
          "OPENAI_API_KEY is not configured yet. Add it in Vercel environment variables or .env.local to enable AI chat."
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: resumeContext
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `LLM request failed with status ${response.status}`,
          detail: errorText
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      output_text?: string;
    };

    return NextResponse.json({
      reply: data.output_text || "I could not generate a response. Please try again."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while generating AI response." },
      { status: 500 }
    );
  }
}
