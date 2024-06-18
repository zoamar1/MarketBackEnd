import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getOrdersFromUsers(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/pedido/:userId', {
    schema:{
      summary: 'Create an order from a customer by ID',
      tags: ['order'],
      params:z.object({
        userId: z.preprocess(val=>Number(val), z.number().int())
      })
    }
  }, async (request,reply) => {
    const {userId} = request.params

    const ordersFromUser = await prisma.customers.findMany({
      where:{id: userId}, select:{Orders:true}
    })

    if(ordersFromUser.length === 0){
      return reply.status(404).send('No order was found')
     }
     return reply.status(200).send(ordersFromUser)
  })
}