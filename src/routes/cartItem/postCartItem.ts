import { prisma } from '../../lib/prisma'
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod";


export async function postCartItem(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/clientes/:customerId/carrinho', {
      schema: {
        body: z.object({
          productId: z.number().int()
        }),
        params: z.object({
          customerId: z.string()
        }),
        response: {
          201: z.object({
            message: z.string()
          })
        }
      }
    }, async (request, reply) => {
      const productId = request.body.productId
      const customerId = parseInt(request.params.customerId)
      
      const customer = await prisma.customers.findUnique({
        where: { id: customerId }
      })

      if (!customer) {
        return reply.status(404).send({ message: "Customer Doesn't Exist" })
      }

      const cart = await prisma.cart.findFirst({
        where: { customersId: customerId }
      })

      if (!cart) {
        return reply.status(404).send({ message: "Customer's Cart Not Found" })
      }

      const createCartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          qty: 50
        }
      })

      return reply.status(201).send({ message: "CartItem Created" })
    })
}
