import { FastifyRequest, FastifyReply } from 'fastify';

export default async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error : any) {
    reply.code(401).send({
      statusCode: 401,
      code: 'FST_JWT_AUTHORIZATION_TOKEN_INVALID',
      error: 'Unauthorized',
      message: 'Authorization token is invalid: ' + error.message,
    });
    return;
  }
}
