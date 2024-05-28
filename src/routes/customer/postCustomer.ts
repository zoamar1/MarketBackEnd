import { prisma } from '../../lib/prisma'
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod";


export async function postCustomer(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/clientes', {
      schema: {
        body: z.object({
          name: z.string(),
          loginId: z.number().int(),
          addressId: z.number().int().nullable(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            customerId: z.number().int(),
            cartId: z.number().int()
          })
        }
      }
    }, async (request, reply) => {
      const { name, loginId, addressId } = request.body

      const event = await prisma.customers.create({
        data: {
          name,
          loginId,
          addressId,
        }
      })

      const cart = await prisma.cart.create({
        data:{
          customersId: event.id
        }
      })


      return reply.status(201).send(
      { 
      message: 'Customer and Cart created',
      customerId: event.id,
      cartId: cart.id 
    })
    })
}