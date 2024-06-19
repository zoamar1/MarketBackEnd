import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { error } from "console";
import bcrypt from "bcrypt"

export async function postLogin(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/postLogin', {
      schema: {
        summary: 'Update password from a email by ID',
        tags: ['login'],
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8).max(25),
          isAdmin: z.boolean()
        }),
        response: {
          201: z.object({ message: z.string() }),
          409: z.object({error: z.string()})
        }
      }
    }, async (request, reply) => {
      try {
        const { email, password, isAdmin } = request.body

        const hashedPassword = await bcrypt.hash(password, 10);

        const createLogin = await prisma.login.create({
          data: {
            email,
            password: hashedPassword,
            isAdmin
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