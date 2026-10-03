import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./token";

export const API_BASE_URL =
  "https://oline-shop-backend.onrender.com";

export type ApiRequestOptions =
  RequestInit & {
    auth?: boolean;
  };

let refreshPromise: Promise<boolean> | null =
  null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken =
    getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    const responseData =
      data?.data ?? data;

    const accessToken =
      responseData?.accessToken ??
      responseData?.access_token ??
      responseData?.token;

    const newRefreshToken =
      responseData?.refreshToken ??
      responseData?.refresh_token;

    if (!accessToken) {
      return false;
    }

    setTokens(
      accessToken,
      newRefreshToken
    );

    return true;
  } catch {
    return false;
  }
}

async function getRefreshPromise(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise =
      refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function makeRequest<T>(
  endpoint: string,
  options: ApiRequestOptions,
  retry = false
): Promise<T> {
  const {
    auth = true,
    headers,
    ...requestOptions
  } = options;

  const requestHeaders =
    new Headers(headers);

  requestHeaders.set(
    "Content-Type",
    "application/json"
  );

  const accessToken =
    getAccessToken();

  if (auth && accessToken) {
    requestHeaders.set(
      "Authorization",
      `Bearer ${accessToken}`
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...requestOptions,
      headers: requestHeaders,
    }
  );

  /*
   * Access token eskirgan.
   */
  if (
    response.status === 401 &&
    auth &&
    !retry
  ) {
    const refreshed =
      await getRefreshPromise();

    if (refreshed) {
      return makeRequest<T>(
        endpoint,
        options,
        true
      );
    }

    clearTokens();

    window.location.href = "/login";

    throw new Error(
      "Sessiya tugadi. Qayta login qiling."
    );
  }

  if (!response.ok) {
    let errorMessage =
      `Request failed: ${response.status}`;

    try {
      const errorData =
        await response.json();

      if (
        typeof errorData?.message ===
        "string"
      ) {
        errorMessage =
          Array.isArray(
            errorData.message
          )
            ? errorData.message.join(", ")
            : errorData.message;
      } else if (
        typeof errorData?.detail ===
        "string"
      ) {
        errorMessage =
          errorData.detail;
      }
    } catch {
      // JSON bo'lmasa default xabar ishlaydi.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    return response.json() as Promise<T>;
  }

  return undefined as T;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  return makeRequest<T>(
    endpoint,
    options
  );
}