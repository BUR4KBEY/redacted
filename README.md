[![NPM Version](https://img.shields.io/npm/v/%40burakbey%2Fredacted?style=for-the-badge&logo=npm&color=blue&cacheSeconds=3600)](https://npmjs.com/package/@burakbey/redacted)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/bur4kbey/redacted/test.yaml?style=for-the-badge&label=tests&cacheSeconds=3600)](https://github.com/BUR4KBEY/redacted/actions/workflows/test.yaml)
[![Codecov](https://img.shields.io/codecov/c/github/bur4kbey/redacted?style=for-the-badge&cacheSeconds=3600)](https://app.codecov.io/gh/BUR4KBEY/redacted)
[![GitHub License](https://img.shields.io/github/license/bur4kbey/redacted?style=for-the-badge)](https://github.com/BUR4KBEY/redacted/blob/main/LICENSE)
[![GitHub Repo stars](https://img.shields.io/github/stars/bur4kbey/redacted?style=for-the-badge&label=%E2%AD%90%20STARS&color=yellow&cacheSeconds=3600)](https://github.com/BUR4KBEY/redacted)

# 🔐 [@burakbey/redacted](https://npmjs.com/package/@burakbey/redacted)

This is a library designed to safeguard sensitive data in your code. It provides a `Redacted` class that uses various techniques to prevent unintentional exposure of sensitive information. Even if an attempt is made to expose the data, it will appear as `<redacted>`.

## 📚 Credits

This library is inspired by concepts discussed in [this YouTube video](https://www.youtube.com/watch?v=p5J8b54ZxOk).

## 🚀 Installation

To install the package, use your preferred package manager. Here’s an example using `pnpm`:

```bash
pnpm add @burakbey/redacted
```

## 📝 Example Usage

The following example demonstrates usage in TypeScript. The library is also **compatible** with JavaScript.

```typescript
import { Redacted } from '@burakbey/redacted';

// Unsafe Example:
// The value can be exposed if logged or written to a file without caution.
const password = 'super-secret-password';
console.log(password); // super-secret-password

// Safe Example:
// Use the `wrap` method to protect the value.
// The `unwrap` method explicitly reveals the original value, ensuring intentional access.
const password = Redacted.wrap('super-secret-password');
console.log(password); // <redacted>
console.log(Redacted.unwrap(password)); // super-secret-password
```

## 🔄 Change the Redacted Message

You can customize the default redacted message (`<redacted>`) to any string you prefer. To do this, set the environment variable `REDACTED_MESSAGE` to your desired value.

For example, if you set `REDACTED_MESSAGE="[REDACTED]"` and run the code, the output will reflect this change.

```ts
// example.ts

import { Redacted } from '@burakbey/redacted';

const password = Redacted.wrap('super-secret-password');
console.log(password); // [REDACTED]
```

## 🧪 Code Coverage and Tests

Tests are crucial for ensuring that the library functions as expected. You can review the code coverage reports by visiting [**Codecov**](https://app.codecov.io/gh/BUR4KBEY/redacted). The primary objective is to achieve complete coverage of the entire codebase through rigorous testing.

## ☕ Support

If you find this project useful and would like to support [me](https://github.com/BUR4KBEY), you can do so by visiting [my website](https://burakbey.dev).

<a href="https://burakbey.dev" target="_blank"><img src="https://burakbey.dev/github_support_snippet.png" style="height: 56px !important;width: 200px !important;" alt="Buy me a coffee"></img></a>
