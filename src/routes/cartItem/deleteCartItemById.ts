import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteCartItemById(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete('/itensCarrinho/:cartItemId', {
    schema:{
      summary: 'Delete cartItem by ID',
      tags: ['cartItem'],
      body:z.object({cartItemId: z.number().int()})
      },
}
  , async (request, reply) => {
    const {cartItemId} = request.body
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