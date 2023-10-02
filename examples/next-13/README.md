# Hopfield with Next 13 RSC

This is an example of how the `hopfield` TypeScript package can be used with OpenAI to stream LLM responses with React Server Components in Next.js 13.

## Setting Up

Before you can stream a response, you'll need to:

1. Set up the `OpenAI` client.
2. Instantiate a `hopfield` client with the `OpenAI` client.
3. Create a streaming chat provider with Hopfield.

```tsx
import hop, { readableFromAsyncIterable } from "hopfield";
import openai from "hopfield/openai";
import OpenAI from "openai";

// Create an OpenAI API client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Instantiate a new Hopfield client with the OpenAI API client
const hopfield = hop.client(openai).provider(openaiClient);

// Create the Hopfield streaming chat provider
const chat = hopfield.chat("gpt-3.5-turbo-16k-0613").streaming();
```

### Constructing Messages & Streaming

The messages to be passed to the chat are constructed using `hop.inferMessageInput`. A system message is added to guide the model, and then the user message is added.

You then get a streaming chat completion with strong types.

```tsx
// construct messages based on the expected types for the chat provider
const messages: hop.inferMessageInput<typeof chat>[] = [
  {
    role: "system",
    content:
      "You are a developer evangelist for the Hopfield Typescript npm package.",
  },
  {
    role: "user",
    content: prompt,
  },
];

// Get a streaming chat completion
const response = await chat.get({
  messages: messages,
});
```

To save costs, the response is mapped into a string in the `onDone` callback from `readableFromAsyncIterable`, and stored in Redis.

```tsx
const stream = readableFromAsyncIterable(response, {
  onDone: async (data) => {
    const storedResponse = data
      .map((chunk) =>
        chunk.choices[0].__type === "content"
          ? chunk.choices[0].delta.content
          : ""
      )
      .join("");
    await kv.set(promptHash, storedResponse);
    await kv.expire(promptHash, 60 * 10);
  },
});
```

### Rendering the Stream in React

The stream of tokens from the response is then rendered using the `<Tokens />` React component. This uses React's `Suspense` and a recursive approach to display each token as it arrives.

```typescript
async function Tokens(props: Props) {
  const { stream } = props;
  const reader = stream.getReader();
  return (
    <Suspense>
      <RecursiveTokens reader={reader} />
    </Suspense>
  );
}

async function RecursiveTokens({ reader }: InternalProps) {
  const { done, value } = await reader.read();
  if (done) {
    return null;
  }
  return (
    <>
      {value.choices[0].__type === "content" ? (
        value.choices[0].delta.content
      ) : (
        <></>
      )}
      <Suspense fallback={null}>
        <RecursiveTokens reader={reader} />
      </Suspense>
    </>
  );
}
```

### Caching Responses

To optimize further and save costs, you can cache the response and then construct a fake stream from the cached chunks when needed.

```typescript
const getCachedResponse = async (prompt: string) => {
  const cached = (await kv.get(prompt)) as string | undefined;
  if (cached) {
    const chunks = cached.split(" ");
    const stream = new ReadableStream<hop.inferResult<typeof chat>>({
      // ... [implementation details]
    });
    return <Tokens stream={stream} />;
  }
  return null;
};
```

This approach ensures efficient usage of the OpenAI API while providing real-time streaming of responses to the end-user.
