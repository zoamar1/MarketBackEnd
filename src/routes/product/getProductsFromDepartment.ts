import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";



export async function getProductsFromDepartment(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/produtos/:departmentId', {
    schema: {
      params: z.object({
        departmentId: z.preprocess(val=> Number(val), z.number().int())
      }),
      querystring: z.object({
        name: z.string().optional(),
        size: z.string().optional(),
        color: z.string().optional(),
        forSale: z.preprocess(val => val !== undefined ? val === 'true' : undefined, z.boolean().optional()),
        minPrice: z.preprocess(val => val !== undefined ? parseFloat(String(val))
        : undefined, z.number().finite().optional()),
        maxPrice: z.preprocess(val => val !== undefined ? parseFloat(String(val))
        : undefined, z.number().finite().optional())
      })
    }
  }, async (request,reply) => {
    const {departmentId} = request.params
    const {name, size, color,forSale, minPrice, maxPrice} = request.query
   
    let products = await prisma.products.findMany({
      where:{departmentId}, 
      include: {itemProduct: true}
    })
    
    if(forSale === true) {
      let products = await prisma.products.findMany({
      where:{departmentId, forSale:true}, 
      include: {itemProduct: true}
    })}
    
    
    if (products.length === 0){
      return reply.status(404).send("No product was found")
    }

    if (name) {
      products = products.filter(product => product.name.includes(name))
    } 

    if (size) {
      products = products.filter(product => 
        product.itemProduct.some(item=>item.size === size))
    }

    if (minPrice){
      products = products.filter(product =>{
        if (product.priceWithDiscount){
          return product.priceWithDiscount >= minPrice 
        } else {
          return product.price >= minPrice
        }
      })
    }
    
    if (maxPrice){
      products = products.filter(product =>{
        if (product.priceWithDiscount){
          return product.priceWithDiscount <= maxPrice
        } else {
          return product.price <= maxPrice
        }
      })
    }

    if (maxPrice){
      products = products.filter(product =>{
        if (product.priceWithDiscount){
          return product.priceWithDiscount <= maxPrice
        } else {
          return product.price <= maxPrice
        }
      })
    }

    if(color){
      products = products.filter(product => product.color === color)
    }

    return reply.status(200).send(products)
  }) 
}