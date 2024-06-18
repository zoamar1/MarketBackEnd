import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";


export async function getAllLogins(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/logins', {
    schema: {
      summary: 'Get all logins',
      tags: ['login'],
      response:{
        200:z.object({array: z.any()}),
        404:z.object({message: z.string()}),
        500:z.object({message: z.string(), error: z.any()})
      }
    }
  }, async (request, reply) => {
    try {
      const logins = await prisma.login.findMany({})
      if (logins.length === 0) {
        return reply.status(404).send({message: "No login was found"})
      }
      return reply.status(200).send({array: logins})
    } catch (error) {
      return reply.status(500).send(
        {
          message: "Internal Server Error",
          error: error
        })
    }
  })
}