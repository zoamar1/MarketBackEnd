import {prisma} from '../src/lib/prisma'
import { Prisma } from '@prisma/client'

async function seed() {
  await prisma.login.create({
    data: {
      email: "eeeeeeba@gmail.com",
      password: "eitaaahehe"
    }
  })

  await prisma.addresses.create({
    data:{
      zip_code: "80400-130",
      state: "Paraná",
      city: "Curitiba",
      street: "Rua Visconde Torres",
      number: 322,
    }
  })

  await prisma.departaments.create({
    data:{
      name: "Postes"
    }
  })
  
}

seed().then(() => {
  console.log('Foi')
  prisma.$disconnect()
})