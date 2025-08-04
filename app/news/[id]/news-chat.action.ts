"use server";

import { streamText } from "ai";
import { DEFAULT_MODEL } from "@/lib/models";

export async function* getNewsChat(
  title: string,
  content: string,
  userPrompt: string
) {
  const reader = await (
    await streamText({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: `你是一位新闻分析师，帮助用户理解新闻文章。文章内容如下：

标题：${title}

内容：${content}

请用中文提供深入、平衡且信息丰富的回复。你可以：
- 总结关键要点
- 提供背景信息
- 分析影响和意义
- 解释技术或复杂概念
- 讨论不同观点
- 回答关于内容的具体问题

请保持回复简洁，专注于文章内容。`,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }).textStream
  ).getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield value;
  }
}
