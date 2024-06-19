import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteCartItemById(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete('/itensCarrinho/:cartItemId', {
    schema:{
      summary: 'Delete cartItem by ID',
      tags: ['cartItem'],
      headers: z.object({
        token: z.string(),
      }),
      params: z.object({
        cartItemId: z.preprocess(val =>Number(val), z.number().int())
      })
    }
  }, async (request, reply) => {
    const {cartItemId} = request.params
    
    const cartItem = await prisma.cartItem.findUnique({
      where:{
        id: cartItemId,
      }
    })

    if(!cartItem){
      return reply.status(404).send('No cartItem was found')
    }

    const deleteCartItem = await prisma.cartItem.delete({
      where:{
        id: cartItem.id
      }
    })

    return reply.status(200).send({ message: "CartItem deleted" });
  })
}