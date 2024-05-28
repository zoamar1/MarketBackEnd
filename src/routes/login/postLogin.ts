import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../../lib/prisma";


export async function postLogin(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/login', {
    schema: {
      body: z.object({
        email: z.string(),
        password: z.string()
      }),
      response: {
        201: z.object({message: z.string()})
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body
    const createLogin = await prisma.login.create({
      data: {
        email,
        password
      }
    })

    return reply.status(201).send({message: "TA POSTADO MAS NAO VAI!!!!!!!!!!!!!!!!!!!"})
  })
}