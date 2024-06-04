import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function putUpdateCustomerAddress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put('/clientes/endereco',
    {
      schema: {
        body:z.object({
          customerId: z.number().int(),
          addressId: z.number().int()
        })
      }
    }, async (request,reply) => {
      const {customerId, addressId} = request.body

      const updateCustomerAddress = await prisma.customers.update({
        where:{id:customerId},
        data:{addressId,}
      })

      if(!updateCustomerAddress){
        return reply.status(404).send("Customer not found")
      }

      return reply.status(200).send(`Address of customer ${customerId} was updated`)
    }
  )
}