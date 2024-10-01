export class ServiceResult<T> {
    readonly isSuccessful: boolean;
    readonly result: T;


    private constructor(isSuccessful: boolean, result: T) {
        this.isSuccessful = isSuccessful;
        this.result = result;
    }


    static createSuccessfull<T>(result: T) {
        return new ServiceResult(true, result);
    }

    static createUnsuccessfull<T>() {
        return new ServiceResult(false, null as T);
    }
}