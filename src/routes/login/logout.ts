import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function logout(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/logout",{
    schema:{
      summary: "Logout the user",
        tags: ["login"]
    }
  } ,async (request, reply) => {
    try {
      reply.clearCookie("access_token");
      return reply.status(200).send({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
