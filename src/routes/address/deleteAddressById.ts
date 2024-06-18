import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z, { any } from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteAddressById(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete('/endereco/:addressId', {
    schema:{
      params:z.object({
        addressId: z.preprocess(val=> Number(val), z.number().int())
      })
    }
  }, async (request, reply) => {
    const { addressId } = request.params;

    try {
      const address = await prisma.addresses.findUnique({
        where: { id: addressId }
      });

      if (!address) {
        return reply.status(404).send({ message: 'No address was found' });
      }

      const deletedAddress = await prisma.addresses.delete({
        where: { id: address.id }
      });

      return reply.status(200).send({ message: 'Address deleted' });
    } catch (error : any) {
      return reply.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  });
}