import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { error } from "console";


export async function postLogin(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/login', {
      schema: {
        summary: 'Update password from a email by ID',
        tags: ['login'],
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8).max(25)
        }),
        response: {
          201: z.object({ message: z.string() }),
          409: z.object({error: z.string()})
        }
      }
    }, async (request, reply) => {
      try {
        const { email, password } = request.body

        const createLogin = await prisma.login.create({
          data: {
            email,
            password
          }
        })
        return reply.status(201).send({ message: "Login created" })

      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
         
          if (e.code === 'P2002') {
           return reply.status(409).send({error:'This email already exists'})
          }
        }
        throw e
      }
    })
}