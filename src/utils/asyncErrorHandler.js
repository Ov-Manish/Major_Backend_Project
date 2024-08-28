const asyncHandler=(reqHandle)=>{
    (req,res,next)=>{
        Promise.resolve(reqHandle(req,res,next)).catch((err)=>{
            next(err)
        })
    }
}
export {asyncHandler}