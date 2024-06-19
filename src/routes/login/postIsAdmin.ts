import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import bcrypt from "bcrypt";


export async function postIsAdmin(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/login/isAdmin', {
    schema: {
      summary: 'Check if a login is a admin',
      tags: ['login'],
      body:z.object({
        email: z.string().email(),
        password: z.string()
      }),
      response:{
        200:z.object({message: z.any()}),
        404:z.object({message: z.string()}),
        500:z.object({message: z.string(), error: z.any()}),
        401:z.object({error:z.string()}),
        403:z.object({error:z.string()})
      }
    }
  }, async (request, reply) => {
    try {
      const {email, password} = request.body

      const user = await prisma.login.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return reply
          .status(401)
          .send({ error: "Invalid email or password." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply
          .status(401)
          .send({ error: "Invalid email or password." });
      }

      if (user.isAdmin === false){
        return reply
        .status(403)
        .send({ error: "This login is not an admin" });
      }

      reply.status(200).send({message: "OK" })

    } catch (error) {
      return reply.status(500).send(
        {
          message: "Internal Server Error",
          error: error
        })
    }
  })
}