import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";


export async function getAllCartItems(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/itensCarrinho', {
    schema: {
      response:{
        200:z.object({array: z.any()}),
        404:z.object({message: z.string()}),
        500:z.object({message: z.string(), error: z.any()})
      }
    }
  }, async (request, reply) => {
    try {
      const cartItems = await prisma.cartItem.findMany({})
      if (cartItems.length === 0) {
        return reply.status(404).send({message: "No cartItem was found"})
      }
      return reply.status(200).send({array: cartItems})
    } catch (error) {
      return reply.status(500).send(
        {
          message: "Internal Server Error",
          error: error
        })
    }
  })
}