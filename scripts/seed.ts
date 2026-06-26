/**
 * Seed Data — FamilyXP
 *
 * Ce script charge les données de démonstration dans les émulateurs Firebase.
 * ATTENTION : Ces données sont UNIQUEMENT pour le développement.
 * La logique produit ne doit JAMAIS référencer ces données en dur.
 *
 * Usage : npm run seed
 */

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore'
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword
} from 'firebase/auth'

// ==========================================
// Configuration Firebase (émulateurs)
// ==========================================

const firebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'localhost',
  projectId: 'familyxp-dev',
  storageBucket: 'familyxp-dev.appspot.com',
  messagingSenderId: '000000000000',
  appId: 'test-app-id'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

connectFirestoreEmulator(db, 'localhost', 8080)
connectAuthEmulator(auth, 'http://localhost:9099')

// ==========================================
// Helper functions
// ==========================================

async function createUser(email: string, password: string, displayName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const userId = userCredential.user.uid

  await setDoc(doc(db, 'users', userId), {
    id: userId,
    displayName,
    email,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  })

  return userId
}

async function createHousehold(name: string, createdBy: string, description?: string) {
  const householdRef = doc(collection(db, 'households'))
  const householdId = householdRef.id

  await setDoc(householdRef, {
    id: householdId,
    name,
    description: description || '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy,
    isPremium: false,
    settings: {
      currency: 'XP',
      maxPointsPerDay: 100,
      requireValidation: true
    }
  })

  return householdId
}

async function createMembership(
  userId: string,
  householdId: string,
  role: 'admin' | 'parent' | 'child' | 'viewer',
  displayName: string,
  points: number = 0
) {
  const membershipId = `${userId}_${householdId}`
  await setDoc(doc(db, 'memberships', membershipId), {
    id: membershipId,
    userId,
    householdId,
    role,
    displayName,
    points,
    joinedAt: Timestamp.now(),
    isActive: true
  })
}

async function createContract(
  householdId: string,
  name: string,
  createdBy: string,
  rules: any[],
  rewards: any[]
) {
  const contractRef = doc(collection(db, 'contracts'))
  const contractId = contractRef.id

  await setDoc(contractRef, {
    id: contractId,
    householdId,
    name,
    description: 'Contrat familial négocié ensemble',
    status: 'active',
    startDate: Timestamp.now(),
    endDate: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy,
    validatedBy: [createdBy],
    rules,
    rewards
  })

  return contractId
}

// ==========================================
// Seed data
// ==========================================

async function seed() {
  console.log('🌱 Début du seed...\n')

  // ---- Création des utilisateurs ----

  console.log('📝 Création des utilisateurs...')

  const davidId = await createUser('david@familyxp.dev', 'password123', 'David')
  const aydéId = await createUser('ayde@familyxp.dev', 'password123', 'Aydé')
  const diegoId = await createUser('diego@familyxp.dev', 'password123', 'Diego')
  const oscarId = await createUser('oscar@familyxp.dev', 'password123', 'Oscar')
  const krystelId = await createUser('krystel@familyxp.dev', 'password123', 'Krystel Flor')
  const stephId = await createUser('steph@familyxp.dev', 'password123', 'Steph')
  const wendyId = await createUser('wendy@familyxp.dev', 'password123', 'Wendy')
  const hugoId = await createUser('hugo@familyxp.dev', 'password123', 'Hugo')
  const lisaId = await createUser('lisa@familyxp.dev', 'password123', 'Lisa')
  const docdadiId = await createUser('docdadi@familyxp.dev', 'password123', 'Docdadi')
  const josephineId = await createUser('josephine@familyxp.dev', 'password123', 'Joséphine')
  const kikiId = await createUser('kiki@familyxp.dev', 'password123', 'Kiki')
  const jpId = await createUser('jp@familyxp.dev', 'password123', 'Jean-Pierre')

  console.log('✅ Utilisateurs créés\n')

  // ---- Création des foyers ----

  console.log('🏠 Création des foyers...')

  const foyerPapaId = await createHousehold('Foyer Papa', davidId, 'Foyer de David')
  const foyerMamanId = await createHousehold('Foyer Maman', krystelId, 'Foyer de Krystel Flor')
  const foyerStephId = await createHousehold('Foyer Steph & Wendy', stephId, 'Foyer de Steph et Wendy')
  const foyerDocdadiId = await createHousehold('Foyer Docdadi & Joséphine', docdadiId, 'Foyer de Docdadi et Joséphine')
  const foyerKikiId = await createHousehold('Foyer Kiki & Jean-Pierre', kikiId, 'Foyer de Kiki et Jean-Pierre')

  console.log('✅ Foyers créés\n')

  // ---- Création des memberships ----

  console.log('👥 Création des memberships...')

  // Foyer Papa
  await createMembership(davidId, foyerPapaId, 'admin', 'David', 150)
  await createMembership(aydéId, foyerPapaId, 'parent', 'Aydé', 120)
  await createMembership(diegoId, foyerPapaId, 'child', 'Diego', 85)
  await createMembership(oscarId, foyerPapaId, 'child', 'Oscar', 60)

  // Foyer Maman
  await createMembership(krystelId, foyerMamanId, 'admin', 'Krystel Flor', 200)
  await createMembership(diegoId, foyerMamanId, 'child', 'Diego', 45)
  await createMembership(oscarId, foyerMamanId, 'child', 'Oscar', 30)

  // Foyer Steph & Wendy
  await createMembership(stephId, foyerStephId, 'admin', 'Steph', 100)
  await createMembership(wendyId, foyerStephId, 'parent', 'Wendy', 90)
  await createMembership(hugoId, foyerStephId, 'child', 'Hugo', 75)
  await createMembership(lisaId, foyerStephId, 'child', 'Lisa', 55)

  // Foyer Docdadi & Joséphine
  await createMembership(docdadiId, foyerDocdadiId, 'admin', 'Docdadi', 180)
  await createMembership(josephineId, foyerDocdadiId, 'parent', 'Joséphine', 160)
  await createMembership(diegoId, foyerDocdadiId, 'child', 'Diego', 20)
  await createMembership(oscarId, foyerDocdadiId, 'child', 'Oscar', 15)
  await createMembership(hugoId, foyerDocdadiId, 'child', 'Hugo', 10)
  await createMembership(lisaId, foyerDocdadiId, 'child', 'Lisa', 5)

  // Foyer Kiki & Jean-Pierre
  await createMembership(kikiId, foyerKikiId, 'admin', 'Kiki', 170)
  await createMembership(jpId, foyerKikiId, 'parent', 'Jean-Pierre', 140)
  await createMembership(diegoId, foyerKikiId, 'child', 'Diego', 25)
  await createMembership(oscarId, foyerKikiId, 'child', 'Oscar', 20)
  await createMembership(hugoId, foyerKikiId, 'child', 'Hugo', 15)
  await createMembership(lisaId, foyerKikiId, 'child', 'Lisa', 10)

  console.log('✅ Memberships créés\n')

  // ---- Création des contrats ----

  console.log('📜 Création des contrats...')

  // Contrat Foyer Papa
  await createContract(
    foyerPapaId,
    'Contrat Foyer Papa - Été 2026',
    davidId,
    [
      {
        id: 'rule-1',
        type: 'bonus',
        category: 'school',
        name: 'Devoirs faits avant 18h',
        description: 'Faire ses devoirs sans rappel',
        points: 10,
        icon: '📚',
        frequency: 'daily',
        maxPerDay: 1,
        requiresValidation: true,
        isActive: true
      },
      {
        id: 'rule-2',
        type: 'bonus',
        category: 'chores',
        name: 'Ranger sa chambre',
        description: 'Chambre rangée avant le dîner',
        points: 5,
        icon: '🧹',
        frequency: 'daily',
        maxPerDay: 1,
        requiresValidation: false,
        isActive: true
      },
      {
        id: 'rule-3',
        type: 'malus',
        category: 'behavior',
        name: 'Comportement irrespectueux',
        description: 'Parler sans respect, crier, insulter',
        points: -10,
        icon: '😤',
        frequency: 'daily',
        maxPerDay: 3,
        requiresValidation: true,
        isActive: true
      },
      {
        id: 'rule-4',
        type: 'bonus',
        category: 'health',
        name: 'Brosser les dents',
        description: 'Se brosser les dents matin et soir sans rappel',
        points: 3,
        icon: '🪥',
        frequency: 'daily',
        maxPerDay: 2,
        requiresValidation: false,
        isActive: true
      }
    ],
    [
      {
        id: 'reward-1',
        name: '1h d\'écran supplémentaire',
        description: 'Une heure de téléphone/console en plus',
        pointsCost: 50,
        icon: '📱',
        category: 'screen_time',
        stock: null,
        isActive: true
      },
      {
        id: 'reward-2',
        name: 'Sortie cinéma',
        description: 'Aller voir un film au cinéma',
        pointsCost: 100,
        icon: '🎬',
        category: 'activity',
        stock: null,
        isActive: true
      },
      {
        id: 'reward-3',
        name: 'Petit budget shopping',
        description: '10€ pour acheter ce que tu veux',
        pointsCost: 80,
        icon: '🛍️',
        category: 'money',
        stock: null,
        isActive: true
      }
    ]
  )

  // Contrat Foyer Maman
  await createContract(
    foyerMamanId,
    'Contrat Foyer Maman - Été 2026',
    krystelId,
    [
      {
        id: 'rule-m1',
        type: 'bonus',
        category: 'school',
        name: 'Lecture quotidienne',
        description: 'Lire 20 minutes par jour',
        points: 8,
        icon: '📖',
        frequency: 'daily',
        maxPerDay: 1,
        requiresValidation: true,
        isActive: true
      },
      {
        id: 'rule-m2',
        type: 'bonus',
        category: 'chores',
        name: 'Aider à mettre la table',
        description: 'Mettre la table pour le dîner',
        points: 5,
        icon: '🍽️',
        frequency: 'daily',
        maxPerDay: 1,
        requiresValidation: false,
        isActive: true
      }
    ],
    [
      {
        id: 'reward-m1',
        name: 'Choisir le menu du dîner',
        description: 'Tu choisis ce qu\'on mange ce soir',
        pointsCost: 40,
        icon: '🍕',
        category: 'activity',
        stock: null,
        isActive: true
      }
    ]
  )

  console.log('✅ Contrats créés\n')
  console.log('🎉 Seed terminé avec succès !')
  console.log('\n📊 Résumé :')
  console.log('  • 13 utilisateurs')
  console.log('  • 5 foyers')
  console.log('  • 22 memberships')
  console.log('  • 2 contrats avec règles et récompenses')
  console.log('\n🔐 Identifiants de test :')
  console.log('  • Email : david@familyxp.dev')
  console.log('  • Mot de passe : password123')
  console.log('\n⚠️  Ces données sont UNIQUEMENT pour le développement !')
}

seed().catch(console.error)
