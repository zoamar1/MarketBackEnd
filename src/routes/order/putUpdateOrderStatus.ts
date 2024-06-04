import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function putUpdateOrderStatus(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put('/pedidos/status', {
    schema: {
      body: z.object({
        id: z.number().int(),
        status: z.string()
      })
    }
  },
    async (request, reply) => {
      const { id, status } = request.body

      const updateStatus = await prisma.orders.update({
        where:{id},
        data:{status}
      })

      if(!updateStatus){
        return reply.status(404).send("No order was found")
      }
      return reply.status(200).send({message:`Order status updated to ${status}`})
    })
}