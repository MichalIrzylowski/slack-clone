# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## API Types Generation (OpenAPI / Swagger)

The backend (NestJS) exposes Swagger at `http://localhost:3000/docs` and raw JSON at `http://localhost:3000/docs-json`.

We generate strongly-typed OpenAPI path definitions using [`openapi-typescript`]. The generated file lives at `src/api/schema.ts` and should not be edited manually.

### Regenerate Types

Run from the frontend workspace directory:

```bash
npm run generate:api
```

You can optionally set an environment variable to point at a different API base:

```bash
VITE_API_URL=https://staging.example.com npm run generate:api
```

### Using the API Client

Basic wrapper functions are provided in `src/api/client.ts`:

```ts
import { api } from "@/api/client";

async function loadChannels() {
  const { data, error } = await api.get("/channels");
  if (error) throw error;
  return data;
}
```

For endpoints with path parameters:

```ts
const { data } = await api.get("/channels/{id}", undefined, {
  Authorization: `Bearer ${token}`,
});
```

For POST / PATCH body payloads:

```ts
await api.post("/channels", { name: "general", isPrivate: false });
```

### Commit Guidelines

- Always commit the updated `schema.ts` when backend endpoints change.
- If the spec introduces breaking changes, update affected frontend calls together with the generated file.

### Troubleshooting

| Issue                  | Fix                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------- |
| 404 fetching docs-json | Ensure backend is running on port 3000 and Swagger is enabled in `main.ts`.           |
| CORS errors in browser | Confirm `FRONTEND_URL` is set in backend env and matches the Vite dev URL.            |
| Types not updating     | Delete `schema.ts` and rerun `npm run generate:api`; verify endpoint output via curl. |

### Future Improvements

- Replace light wrapper with full request/response typing using `openapi-fetch`.
- Auto-generate React Query hooks from spec.
- Add script to download and diff spec for CI.

## Auth-Aware API Wrapper

`src/api/useAuthedApi.ts` exposes:

- `useAuthedApi()` React hook returning an object with `get/post/patch/put/delete` methods.
- `createAuthedApi(token)` factory for non-hook contexts (e.g. websocket event handlers).

Authorization header (`Bearer <token>`) is automatically attached when a valid token is present.

Example using the hook:

```ts
import { useAuthedApi } from "@/api/useAuthedApi";

function ChannelList() {
  const api = useAuthedApi();
  useEffect(() => {
    (async () => {
      const { data, error } = await api.get("/channels");
      if (error) console.error(error);
      // ... use data
    })();
  }, [api]);
}
```

Example using the factory outside React:

```ts
import { createAuthedApi } from "@/api/useAuthedApi";
import { getStoredToken } from "@/auth/useAuth";

const api = createAuthedApi(getStoredToken());
const { data } = await api.post("/channels", { name: "general" });
```

Error handling: Each method returns `{ data, status, error }`; check `error` or non-2xx `status` before using `data`.
