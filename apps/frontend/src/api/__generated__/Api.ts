/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ChannelResponseDto {
  id: string;
  name: string;
  isPrivate: boolean;
  /** @format date-time */
  archivedAt: string | null;
  /** @format date-time */
  deletedAt: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface ChannelListResponseDto {
  items: ChannelResponseDto[];
  /** Cursor for next page or null */
  nextCursor: string | null;
}

export interface CreateChannelDto {
  /**
   * Channel display name
   * @minLength 1
   * @maxLength 50
   */
  name: string;
  /**
   * Whether the channel is private
   * @default false
   */
  isPrivate?: boolean;
}

export interface UpdateChannelDto {
  /**
   * New channel name
   * @minLength 1
   * @maxLength 50
   */
  name?: string;
  /** Change privacy status */
  isPrivate?: boolean;
  /** Archive/unarchive channel */
  archived?: boolean;
}

export interface UserResponseDto {
  id: string;
  /** Display name (for now mirrors username or provided name) */
  name: string;
  /** Email address */
  email: string;
  /** User role */
  role: string;
}

export interface UserListResponseDto {
  items: UserResponseDto[];
}

export interface CreateManagedUserDto {
  /**
   * Email of the new user
   * @example "user@example.com"
   */
  email: string;
  /**
   * Temporary password (will be hashed)
   * @minLength 6
   */
  password: string;
  /** Optional display name */
  name?: string;
  /**
   * Role to assign (admin|member)
   * @example "member"
   */
  role: string;
}

export interface CreateUserDto {
  /**
   * User email (unique)
   * @example "user@example.com"
   */
  email: string;
  /**
   * Username (unique)
   * @minLength 3
   * @maxLength 50
   */
  username: string;
  /** Optional display name (legacy) */
  name?: string;
  /**
   * Password (will be hashed)
   * @minLength 6
   * @maxLength 200
   */
  password: string;
}

export interface LoginDto {
  /**
   * Email address used for login
   * @example "user@example.com"
   */
  email: string;
  /**
   * Password
   * @minLength 6
   * @maxLength 200
   */
  password: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Slack Clone API
 * @version 1.0
 * @contact
 *
 * API documentation for the Slack clone backend
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AppControllerGetHello
   * @request GET:/
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/`,
      method: "GET",
      ...params,
    });

  channels = {
    /**
     * No description
     *
     * @tags channels
     * @name ChannelControllerList
     * @summary List channels with optional search and pagination
     * @request GET:/channels
     */
    channelControllerList: (
      query?: {
        search?: string;
        limit?: string;
        cursor?: string;
        includeArchived?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChannelListResponseDto, any>({
        path: `/channels`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags channels
     * @name ChannelControllerCreate
     * @summary Create a new channel
     * @request POST:/channels
     * @secure
     */
    channelControllerCreate: (
      data: CreateChannelDto,
      params: RequestParams = {},
    ) =>
      this.request<ChannelResponseDto, void>({
        path: `/channels`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags channels
     * @name ChannelControllerUpdate
     * @summary Update a channel
     * @request PATCH:/channels/{id}
     */
    channelControllerUpdate: (
      id: string,
      data: UpdateChannelDto,
      params: RequestParams = {},
    ) =>
      this.request<ChannelResponseDto, void>({
        path: `/channels/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags channels
     * @name ChannelControllerRemove
     * @summary Soft delete a channel
     * @request DELETE:/channels/{id}
     */
    channelControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/channels/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersControllerFindAll
     * @summary Get all users (auth required)
     * @request GET:/users
     * @secure
     */
    usersControllerFindAll: (params: RequestParams = {}) =>
      this.request<UserListResponseDto, void>({
        path: `/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerCreate
     * @summary Create a new user (ADMIN only)
     * @request POST:/users
     * @secure
     */
    usersControllerCreate: (
      data: CreateManagedUserDto,
      params: RequestParams = {},
    ) =>
      this.request<UserResponseDto, void>({
        path: `/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerInitAdmin
     * @summary Initialize the first admin user (only when no users exist)
     * @request POST:/auth/init-admin
     */
    authControllerInitAdmin: (
      data: CreateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/auth/init-admin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerLogin
     * @summary Login and obtain a JWT access token
     * @request POST:/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRegister
     * @summary Register a new user (ADMIN only)
     * @request POST:/auth/register
     * @secure
     */
    authControllerRegister: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerMe
     * @summary Get current authenticated user profile
     * @request GET:/auth/me
     * @secure
     */
    authControllerMe: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerAdminCheck
     * @summary Verify current user has ADMIN role
     * @request GET:/auth/admin-check
     * @secure
     */
    authControllerAdminCheck: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/admin-check`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}
