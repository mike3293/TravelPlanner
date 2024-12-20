import { ServiceBase, ServiceResult } from '../serviceBase';
import { UserStoreApi } from '../serviceBase/types';


export class AuthService extends ServiceBase {
    private readonly store: UserStoreApi;


    constructor(baseURL: string, store: UserStoreApi) {
        super(baseURL);
        this.store = store;
    }


    public async loginAsync(email: string, password: string): Promise<ServiceResult> {
        const accessTokenResult = await this.post<string>('auth/login', { email, password }, undefined, undefined, { credentials: 'include' });

        if (accessTokenResult.isSuccessful) {
            this.store.setState({ accessToken: accessTokenResult.result });
        }

        return accessTokenResult;
    }

    public async registerAsync(email: string, password: string): Promise<ServiceResult> {
        const accessTokenResult = await this.post<string>('auth/register', { email, password }, undefined, undefined, { credentials: 'include' });

        if (accessTokenResult.isSuccessful) {
            this.store.setState({ accessToken: accessTokenResult.result });
        }

        return accessTokenResult;
    }
}
