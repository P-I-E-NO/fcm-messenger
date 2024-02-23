export default class ModelNotFoundError extends Error {
    constructor(str: string){
        super(str);
    }
}