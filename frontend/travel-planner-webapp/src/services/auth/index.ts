import { ServiceBase } from '../serviceBase';
import { UserStoreApi } from '../serviceBase/types';

export class AuthService extends ServiceBase {
    private readonly store: UserStoreApi;


    constructor(baseURL: string, store: UserStoreApi) {
        super(baseURL);
        this.store = store;
    }


    public async loginAsync(email: string, password: string): Promise<boolean> {
        const accessTokenResult = await this.post<string>('auth/login', { email, password });

        if (accessTokenResult.isSuccessful) {
            this.store.setState({ accessToken: accessTokenResult.result });
        }

        return accessTokenResult.isSuccessful;
    }

    public async registerAsync(email: string, password: string): Promise<boolean> {
        const accessTokenResult = await this.post<string>('auth/register', { email, password });

        if (accessTokenResult.isSuccessful) {
            this.store.setState({ accessToken: accessTokenResult.result });
        }

        return accessTokenResult.isSuccessful;
    }
}
