import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email) {
    console.error('❌ ADMIN_EMAIL doit être défini dans .env')
    process.exit(1)
  }

  if (!password) {
    console.error('❌ ADMIN_PASSWORD doit être défini dans .env')
    process.exit(1)
  }

  try {
    // Vérifier si l'admin existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('✅ L\'utilisateur admin existe déjà')
      return
    }

    // Utiliser le système de hash de better-auth
    const ctx = await auth.$context
    const hashedPassword = await ctx.password.hash(password)

    // Créer l'utilisateur admin
    const admin = await prisma.user.create({
      data: {
        email,
        name: 'Administrateur',
        emailVerified: true,
      }
    })

    // Créer le compte avec mot de passe hashé par better-auth
    await prisma.account.create({
      data: {
        userId: admin.id,
        accountId: admin.id,
        providerId: 'credential',
        password: hashedPassword,
      }
    })

    console.log('✅ Utilisateur admin créé avec succès')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Mot de passe: ${password}`)
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin() 