import { db } from './index'
import { users } from './schema'
import { v4 as uuidv4 } from 'uuid'

export async function seedDatabase() {
  try {
    // Create a demo user
    const [demoUser] = await db.insert(users).values({
      id: uuidv4(),
      email: 'demo@example.com',
      name: 'Demo User',
    }).returning()

    console.log('Demo user created:', demoUser)
    return demoUser
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database seeded successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Failed to seed database:', error)
      process.exit(1)
    })
}

