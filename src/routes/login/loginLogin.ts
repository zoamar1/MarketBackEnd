import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function loginLogin(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/login",
    {
      schema: {
        summary: "User login",
        tags: ["login"],
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }),
        response: {
          200: z.object({
            accessToken: z.string(),
            message: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
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

        const token = app.jwt.sign({
          id: user.id,
          email: user.email,
        });

        reply.setCookie("access_token", token, {
          path: "/",
          httpOnly: true,
          secure: true,
        });

        return { accessToken: token, message: "Login make successfully" };
      } catch (error) {
        console.error("Login error:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}