import { Context, Next } from "koa"

export const withConnection = (transactional?: true) => {

    return async(ctx: Context, next: Next) => {

        ctx.state["connection"] = await ctx.app.context["db"].getConnection();
        
        if(transactional){
            await ctx.state["connection"].startTransaction();
        }

        await next();

        if(transactional) {            
            await ctx.state["connection"].commit();
        }
        await ctx.state["connection"].release();

    }

}

export const faultyWithConnection = () => {

    return async(ctx: Context, next: Next) => {

        ctx.state["connection"] = await ctx.app.context["db"].getConnection();
        
        throw new Error('my bad :(')

    }

}

export const faultyWithConnectionTransactional = () => {

    return async(ctx: Context, next: Next) => {

        ctx.state["connection"] = await ctx.app.context["db"].getConnection();
        await ctx.state["connection"].startTransaction();
        
        throw new Error('my bad :(')

    }

}