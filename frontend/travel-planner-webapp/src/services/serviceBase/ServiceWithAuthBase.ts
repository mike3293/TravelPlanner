import { ServiceBase } from './ServiceBase';
import { UserStoreApi } from './types';


export abstract class ServiceWithAuthBase extends ServiceBase {
    private readonly store: UserStoreApi;


    constructor(baseUrl: string, store: UserStoreApi) {
        super(baseUrl);
        this.store = store;
    }


    async willSendRequest(request: RequestInit) {
        let accessToken = this.store.getState().accessToken;

        if (accessToken) {
            request.headers = {
                ...request.headers,
                Authorization: `Bearer ${accessToken}`,
            };
        }
    }

    async refreshSession() {
        const accessTokenResult = await this.fetch<string>('auth/refresh', 'POST', undefined, undefined, undefined, { credentials: 'include' }, false);

        if (accessTokenResult.isSuccessful) {
            this.store.setState({ accessToken: accessTokenResult.result });
        }
    }

    async clearSession() {
        this.store.getState().resetUser();
    }
}
