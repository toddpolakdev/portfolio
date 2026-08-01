import "server-only";

/**
 * Server-side GraphQL client.
 *
 * The public site renders on the server, so nothing here ships to the browser
 * and the admin token never leaves the Node process. Admin writes go through
 * server actions that call `gqlAdmin`.
 */

const ENDPOINT =
  process.env.GRAPHQL_ENDPOINT ??
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
  "http://localhost:4000/api/graphql";

/** Cache tags, so an admin save can invalidate exactly what it changed. */
export const TAGS = {
  sections: "sections",
  projects: "projects",
  contacts: "contacts",
} as const;

export class GraphQLRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GraphQLRequestError";
  }
}

type GqlOptions = {
  variables?: Record<string, unknown>;
  tags?: string[];
  /** Seconds. `0` disables the data cache (used for all admin reads). */
  revalidate?: number;
  admin?: boolean;
};

async function request<T>(
  query: string,
  { variables, tags, revalidate, admin }: GqlOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (admin) {
    const token = process.env.ADMIN_API_TOKEN;
    if (!token) {
      throw new GraphQLRequestError(
        "ADMIN_API_TOKEN is not set — admin requests cannot be authorized."
      );
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    // Admin data must always be fresh; public data is tag-cached.
    cache: revalidate === 0 ? "no-store" : undefined,
    next: revalidate === 0 ? undefined : { revalidate: revalidate ?? 300, tags },
  });

  if (!res.ok) {
    throw new GraphQLRequestError(
      `GraphQL request failed: ${res.status} ${res.statusText}`
    );
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new GraphQLRequestError(
      json.errors.map((e) => e.message).join("; ")
    );
  }

  if (!json.data) {
    throw new GraphQLRequestError("GraphQL response contained no data.");
  }

  return json.data;
}

/** Public, cacheable read. */
export function gql<T>(
  query: string,
  opts: Omit<GqlOptions, "admin"> = {}
): Promise<T> {
  return request<T>(query, opts);
}

/** Authenticated read or write. Never cached. */
export function gqlAdmin<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return request<T>(query, { variables, admin: true, revalidate: 0 });
}
