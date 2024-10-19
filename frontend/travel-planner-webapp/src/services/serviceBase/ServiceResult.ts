export class ServiceResult<T = unknown> {
    readonly isSuccessful: boolean;
    readonly result: T;
    readonly error: string | undefined;


    private constructor(isSuccessful: boolean, result: T, error?: string) {
        this.isSuccessful = isSuccessful;
        this.result = result;
        this.error = error;
    }


    static createSuccessfull<T>(result: T) {
        return new ServiceResult(true, result);
    }

    static createUnsuccessfull<T>(error?: string) {
        return new ServiceResult(false, null as T, error);
    }
}