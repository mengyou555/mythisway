# AI API guide for curriculum writers (topics 16, 11, 7, 2, and parts of 10)

Use this file together with CONTENT_SPEC.md. It covers how to write code that calls an LLM in the lessons.

## Provider and SDK

- Examples call Claude through the **official Anthropic Python SDK**: `python3 -m pip install "anthropic==1.15.0"`, inside a venv. 1.15.0 is the latest on PyPI as of 2026-10-19, and the 1.x line requires Python 3.10+.
- Do not use raw HTTP in Python code.
- Do not mix in OpenAI-compatible shims.
- You may mention that other providers exist and that the concepts transfer.
- TypeScript examples (if any) use `@anthropic-ai/sdk`.

## Model IDs (exact strings, never add date suffixes)

| Model | Model ID | Price per 1M tokens (input / output) |
|---|---|---|
| Claude Opus 5.5 (default, most capable Opus) | `claude-opus-5-5` | $4 / $20 |
| Claude Sonnet 5.5 (faster, cheaper) | `claude-sonnet-5-5` | $2 / $10 |
| Claude Haiku 5.5 (cheapest, simple tasks) | `claude-haiku-5-5` | $0.10 / $0.50 for prompts up to 100K tokens |

- Use `claude-opus-5-5` as the default in examples.
- In examples, read the model from an environment variable with the default above: `MODEL = os.environ.get("CLAUDE_MODEL", "claude-opus-5-5")`.
- Prices change over time. Always say "ราคา ณ ต.ค. 2026 ตรวจสอบล่าสุดที่หน้า Pricing ของผู้ให้บริการ".

## Basic call (current API)

```python
import os
import anthropic

client = anthropic.Anthropic()  # อ่าน ANTHROPIC_API_KEY จาก environment
response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    system="คุณคือผู้ช่วยที่ตอบเป็นภาษาไทยสั้นๆ",
    messages=[{"role": "user", "content": "อธิบาย API ใน 2 ประโยค"}],
)
for block in response.content:
    if block.type == "text":
        print(block.text)
print(response.usage.input_tokens, response.usage.output_tokens)
print(response.stop_reason)  # end_turn | max_tokens | tool_use | refusal | ...
```

### Rules for claude-opus-5-5

- Thinking is always on. Do NOT send `thinking={"type": "disabled"}` and do NOT send `budget_tokens`; both return a 400.
- To control depth and cost, use `output_config={"effort": "low"|"medium"|"high"|"xhigh"|"max"}`. The default on Opus 5.5 is `medium`.
- Do NOT send `temperature`, `top_p` or `top_k`. They return a 400 on this model.
  - Teach the concept of temperature as background knowledge.
  - Say clearly that newer Claude models removed these parameters, and that you steer the model with effort and with the prompt instead.
- Do NOT use assistant prefill (a last assistant message), which returns a 400. Use structured outputs or instructions instead.
- Do NOT force a tool with `tool_choice={"type": "any"}` or `{"type": "tool", ...}`, which returns a 400. Use `auto`, put the tool name in the prompt, and set `strict: True` on the tool.
- Always check `stop_reason` before reading content. Handle `"refusal"` and `"max_tokens"`.
- Error handling, most specific first:

  ```python
  except anthropic.AuthenticationError ...
  except anthropic.RateLimitError ...
  except anthropic.APIStatusError as e: (e.status_code)
  except anthropic.APIConnectionError ...
  ```

- The SDK retries 429 and 5xx errors automatically. The default is `max_retries=2`.

## Streaming

```python
with client.messages.stream(model="claude-opus-5-5", max_tokens=64000,
                            messages=[{"role": "user", "content": "เล่านิทานสั้น"}]) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    final = stream.get_final_message()
```

## Structured outputs

Use the Pydantic helper:

```python
from pydantic import BaseModel
class Ticket(BaseModel):
    category: str
    priority: int
response = client.messages.parse(model="claude-opus-5-5", max_tokens=16000,
    messages=[{"role": "user", "content": "..."}], output_format=Ticket)
ticket = response.parsed_output
```

Or use a raw JSON schema:

- `output_config={"format": {"type": "json_schema", "schema": {...,"additionalProperties": False}}}`
- Then parse the text block with `json.loads`.
- `output_format=` as a top-level argument of `messages.create` is deprecated. Use `output_config` there; `messages.parse(output_format=PydanticModel)` is the supported helper.

## Tool use (AI Agents topic)

### Manual loop

Teach this first, because learners must understand the loop:

```python
messages = [{"role": "user", "content": user_input}]
while True:
    response = client.messages.create(model=MODEL, max_tokens=16000, tools=tools, messages=messages)
    if response.stop_reason == "end_turn":
        break
    if response.stop_reason != "tool_use":
        break  # จัดการ max_tokens / refusal
    messages.append({"role": "assistant", "content": response.content})
    results = []
    for block in response.content:
        if block.type == "tool_use":
            output = run_tool(block.name, block.input)   # block.input เป็น dict แล้ว
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": output})
            # ถ้า error: {"type": "tool_result", "tool_use_id": block.id, "content": "Error: ...", "is_error": True}
    messages.append({"role": "user", "content": results})  # ส่งผลทุก tool ใน user message เดียว
final_text = "".join(b.text for b in response.content if b.type == "text")
```

Tool definition:

```python
{"name": "get_weather", "description": "...", "strict": True,
 "input_schema": {"type": "object", "properties": {...}, "required": [...], "additionalProperties": False}}
```

- Always add an iteration cap (e.g. `max_steps = 10`) as a safety guard.
- Parse tool inputs as dicts, never by string matching.

### Tool Runner (beta, SDK helper)

Show this as the "production shortcut" after the manual loop:

```python
from anthropic import beta_tool

@beta_tool
def get_weather(location: str) -> str:
    """ดูอากาศของเมือง

    Args:
        location: ชื่อเมือง
    """
    return "..."

runner = client.beta.messages.tool_runner(model=MODEL, max_tokens=16000, tools=[get_weather],
                                          messages=[{"role": "user", "content": "..."}])
for message in runner:
    ...
```

## Prompt caching (Prompt Engineering and AI Engineer)

- Simplest form: add `cache_control={"type": "ephemeral"}` as a top-level argument of `messages.create`. It caches the last cacheable block.
- Verify with `response.usage.cache_read_input_tokens` and `cache_creation_input_tokens`.
- Caching is a prefix match: put stable content first, and do not put timestamps in the system prompt.
- Each model has a minimum cacheable length (roughly 512–4096 tokens); a shorter prefix silently will not cache.

## Token counting

- `client.messages.count_tokens(model=MODEL, messages=[...], system="...").input_tokens`
- Do NOT use `tiktoken`. It is OpenAI's tokenizer and is wrong for Claude, especially for Thai text.

## Embeddings and RAG (AI Engineer)

- Anthropic does **not** offer an embeddings endpoint. Anthropic's documentation points to Voyage AI as an embeddings provider.
- Lessons must work **offline without any key**. The primary runnable path:
  - teach embeddings and cosine similarity with a tiny hand-made example (numpy);
  - build retrieval with scikit-learn TF-IDF (`TfidfVectorizer`) or BM25 (`rank-bm25`) over local Thai/English sample documents;
  - for Thai text, mention word segmentation: `pythainlp` (`word_tokenize`). Test it, and pin the version you tested.
- Optional real embeddings path:
  - Voyage AI Python client, `pip install voyageai`, reading `VOYAGE_API_KEY`;
  - or a local model through Ollama;
  - say that model names change and point to the official docs. Keep this path optional and guarded by a key check.
- A vector database is optional. If you use one, prefer something that runs locally with pip only (e.g. `chromadb`). Test it in the sandbox if you use it, and pin the version.
- Evaluation:
  - teach retrieval metrics (precision@k, recall@k, MRR) on a small labelled set;
  - teach answer checks: exact match, keyword checks, and LLM-as-judge (mock in offline mode).

## Mock mode (mandatory in every LLM example)

Every example that calls the API must run without a key:

```python
import os

def make_client():
    if os.environ.get("ANTHROPIC_API_KEY"):
        import anthropic
        return anthropic.Anthropic()
    return None  # โหมดจำลอง

def ask(client, prompt: str) -> str:
    if client is None:
        # โหมดจำลอง: คืนคำตอบที่เขียนไว้ล่วงหน้า เพื่อให้รันได้โดยไม่ต้องมี API Key
        return MOCK_ANSWERS.get(prompt, "[MOCK] ...")
    response = client.messages.create(model=MODEL, max_tokens=1024, messages=[{"role": "user", "content": prompt}])
    return "".join(b.text for b in response.content if b.type == "text")
```

- For the agent loop, write a fake client whose `.messages.create(...)` returns objects with the same shape. Use simple dataclasses with `.type`, `.text`, `.id`, `.name`, `.input`, `.stop_reason` and `.content`.
- The fake client must script a realistic sequence: tool_use first, then end_turn after the tool result arrives.
- That way the whole loop runs and prints real output in the sandbox.
- Show the MOCK output as the "ผลลัพธ์ที่ได้จริง". When the real API would produce different wording, say so in Thai.

## Safety

- Never print or log the API key.
- Teach `.env` + `python-dotenv` (optional), and `.gitignore` for `.env`.
- Teach prompt injection basics (AI Agents and AI Engineer topics):
  - treat retrieved or tool text as data, not instructions;
  - set tool permission boundaries;
  - get human approval for destructive tools.
