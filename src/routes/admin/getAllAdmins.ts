import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";


export async function getAllAdmins(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/admin', {
    schema: {
      response:{
        200:z.object({array: z.any()}),
        404:z.object({message: z.string()}),
        500:z.object({message: z.string(), error: z.any()})
      }
    }
  }, async (request, reply) => {
    try {
      const admin = await prisma.admin.findMany({})
      if (admin.length === 0) {
        return reply.status(404).send({message: "No admin was found"})
      }
      return reply.status(200).send({array: admin})
    } catch (error) {
      return reply.status(500).send(
        {
          message: "Internal Server Error",
          error: error
        })
    }
  })
}