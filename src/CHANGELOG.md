# hopfield

## 0.3.3

### Patch Changes

- [`d3c6ecf`](https://github.com/propology/hopfield/commit/d3c6ecfebe4e0e7760be418a48b42cc4f93730a5) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fix types to use `ZodType<any, any, any>`.

## 0.3.2

### Patch Changes

- [`9b975f8`](https://github.com/propology/hopfield/commit/9b975f8d06cbf51af8c431446a8e7dfaf121a79d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix**: attempt to fix slow types.

## 0.3.1

### Patch Changes

- [`2d1cb18`](https://github.com/propology/hopfield/commit/2d1cb183e81bb03df791b357802b5df0457a5ccb) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added new model versions from latest OpenAI release.

## 0.3.0

### Minor Changes

- [`43ea622`](https://github.com/propology/hopfield/commit/43ea6223b94bffce70a2d9400a000bb880825aeb) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed output types by bundling Zod.

## 0.2.4

### Patch Changes

- [`36fd9c0`](https://github.com/propology/hopfield/commit/36fd9c0e8ece2f2dcf524b6752bd09b82203d130) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** moved project to Bun.

## 0.2.3

### Patch Changes

- [#20](https://github.com/propology/hopfield/pull/20) [`872e6c7`](https://github.com/propology/hopfield/commit/872e6c73a2a892f947d00d46d9beab2d166c4b29) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** moved project to Bun.

## 0.2.3

### Patch Changes

- [`ebab940`](https://github.com/propology/hopfield/commit/ebab9405d231677ce8d0a8d0dbf8f7e92e8bbaed) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixing issue with latest changeset release.

## 0.2.2

### Patch Changes

- [#16](https://github.com/propology/hopfield/pull/16) [`5e27e92`](https://github.com/propology/hopfield/commit/5e27e9236bd12860da6f5e9824c13ae0e12daebe): Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `onFunctionCall` to streaming function provider to enable workflows that validate final function calls while also streaming responses.

## 0.2.1

### Patch Changes

- [#14](https://github.com/propology/hopfield/pull/14) [`5c29dec`](https://github.com/propology/hopfield/commit/5c29dec3ae8f0866513a9648b8f6563df5c48118) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added a `ReadableStream` to the response from the Streaming Chat provider and removed `readableFromAsyncIterable`
  from the exports, to simplify integration.

## 0.2.0

### Minor Changes

- [`9720598`](https://github.com/propology/hopfield/commit/9720598b115a91203e6674710fa534f834611c16) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added async iterator to readable stream for node integration.

## 0.1.4

### Patch Changes

- [#8](https://github.com/propology/hopfield/pull/8) [`24b5bdc`](https://github.com/propology/hopfield/commit/24b5bdcb8f9b3faaceaf99f58fe1e171e4422764) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed some missing types to be explicit.

## 0.1.3

### Patch Changes

- [#6](https://github.com/propology/hopfield/pull/6) [`b2c5b0f`](https://github.com/propology/hopfield/commit/b2c5b0f28d3668dc468d61e15313c5d6a0a889aa) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** update to support latest `openai` version.

## 0.1.2

### Patch Changes

- [#4](https://github.com/propology/hopfield/pull/4) [`d2a02c9`](https://github.com/propology/hopfield/commit/d2a02c977678826557c01f25245d824ae53c249e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added further cleanup based on integration tests.

## 0.1.1

### Patch Changes

- [#2](https://github.com/propology/hopfield/pull/2) [`c0ff697`](https://github.com/propology/hopfield/commit/c0ff6971828591f61e29a7997a324834810e828e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed error paths to correspond with docs.

## 0.1.0

### Minor Changes

- [`e77072a`](https://github.com/propology/hopfield/commit/e77072a076dfb4096e83c732ec631a9cfa6a29e0) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added the initial OpenAI validator to Hopfield, with Streaming/Non-Streaming Chat, Function Calling, Templates, and Embeddings.
