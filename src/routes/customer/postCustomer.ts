import { Prisma } from '@prisma/client';
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
          }),
          409: z.object({error: z.string()})
        }
      }
    }, async (request, reply) => {
      const { name, loginId, addressId } = request.body
      try {
        const event = await prisma.customers.create({
          data: {
            name,
            loginId,
            addressId,
          }
        })

        const cart = await prisma.cart.create({
          data: {
            customersId: event.id
          }
        })


        return reply.status(201).send({
            message: 'Customer and Cart created',
            customerId: event.id,
            cartId: cart.id
          })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
         
          if (e.code === 'P2002') {
           return reply.status(409).send({error:'The loginId is used by another user'})
          }
        }
      }
    })
}