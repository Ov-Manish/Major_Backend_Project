// we will gonna face API errors and then they will come in this standard not randomly formatted ok 

class apiErrors extends Error{
    constructor(
        statusCode,
        message='Error Found ',
        stack='',
        errors=[],
    ){
        super(message);
        this.statusCode=statusCode;
        this.stack=stack;
        this.errors=errors
        this.data=null;
        this.success=false;


        if (stack) {
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export {apiErrors}