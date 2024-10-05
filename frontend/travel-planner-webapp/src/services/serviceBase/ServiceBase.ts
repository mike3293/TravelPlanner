import { toast } from 'react-toastify';
import { ServiceResult } from './ServiceResult';
import { BodyInitOrObject, StatusCode, URLSearchParamsInit } from './types';


const notify = (error: string) => toast(error, { type: "error" });

export abstract class ServiceBase {
    private baseUrl: string;
    protected willSendRequest?(request: RequestInit): void | Promise<void>;
    protected refreshSession?(): void | Promise<void>;
    protected clearSession?(): void | Promise<void>;


    protected constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }


    protected async get<TResult>(
        path: string,
        params?: URLSearchParamsInit,
        init?: RequestInit
    ): Promise<ServiceResult<TResult>> {
        return this.fetch(path, 'GET', params, undefined, init);
    }

    protected async post<TResult>(
        path: string,
        body?: BodyInitOrObject,
        params?: URLSearchParamsInit,
        init?: RequestInit
    ): Promise<ServiceResult<TResult>> {
        return this.fetch(path, 'POST', params, body, init);
    }

    protected async put<TResult>(
        path: string,
        body?: BodyInitOrObject,
        params?: URLSearchParamsInit,
        init?: RequestInit
    ): Promise<ServiceResult<TResult>> {
        return this.fetch<TResult>(path, 'PUT', params, body, init);
    }

    protected async delete<TResult>(
        path: string,
        params?: URLSearchParamsInit,
        init?: RequestInit
    ): Promise<ServiceResult<TResult>> {
        return this.fetch<TResult>(path, 'DELETE', params, undefined, init);
    }

    private async fetch<TResult>(
        path: string,
        method: string,
        params?: URLSearchParamsInit,
        body?: BodyInitOrObject,
        options: RequestInit = {},
        shouldRefreshSession = true
    ): Promise<ServiceResult<TResult>> {
        if (this.willSendRequest) {
            await this.willSendRequest(options);
        }

        if (body) {
            options.body = JSON.stringify(body);

            // If Content-Type header has not been previously set, set to application/json
            options.headers = new Headers(options.headers);
            if (!options.headers.get('Content-Type')) {
                options.headers.set('Content-Type', 'application/json; charset=utf-8');
            }
        }

        try {
            const response = await fetch(
                `${this.baseUrl}${path}${params ? `?${this.buildParams(params)}` : ''}`,
                {
                    method,
                    ...options,
                }
            );

            if (response.status === StatusCode.Unauthorized) {
                if (shouldRefreshSession && this.refreshSession) {
                    await this.refreshSession();

                    return await this.fetch(path, method, params, body, options, false);
                } else if (this.clearSession) {
                    this.clearSession();

                    return ServiceResult.createUnsuccessfull('Login required');
                }
            }

            if (response.status !== StatusCode.Ok) {
                const error = await response.text();

                return ServiceResult.createUnsuccessfull(error);
            }

            const result = await this.parseResponse<TResult>(response);

            return ServiceResult.createSuccessfull(result);
        } catch (err) {
            const errorString = err instanceof Error ? `Request to '${path}' failed. ${err.message}` : `Request to '${path}' failed`;
            notify(errorString);

            return ServiceResult.createUnsuccessfull(errorString);
        }
    }

    private buildParams(search: URLSearchParamsInit) {
        const params = new URLSearchParams();

        Object.entries(search).forEach(([key, value]) => {
            if (!value) {
                return;
            }

            Array.isArray(value)
                ? value.forEach((item) => item && params.append(key, item))
                : params.append(key, value);
        });

        return params;
    }

    private async parseResponse<TResult>(response: Response): Promise<TResult> {
        const contentType = response.headers.get('Content-Type');

        let result;
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            result = await response.text();
        }

        return result;
    }
}
