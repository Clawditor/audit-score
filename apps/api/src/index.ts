import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'

const app = new Hono()
const prisma = new PrismaClient()

// Enable CORS for frontend integration
app.use('*', cors({
  origin: '*', // In production, replace with actual origin
  allowMethods: ['POST', 'GET', 'OPTIONS'],
}))

// Constant for price per line in USD (e.g., $0.05)
const PRICE_PER_LINE = 0.05

app.get('/', (c) => {
  return c.text('Audit Scan Backend API (Hono) 🦞')
})

/**
 * x402 MVP Flow phase 1: Prepare
 */
app.post('/api/prepare-audit', async (c) => {
  try {
    const { sourceCode, address } = await c.req.json()
    
    if (!sourceCode) return c.json({ error: 'No source code provided' }, 400)

    // 1. LoC counter (simple filter for non-empty lines)
    const lines = sourceCode.split('\n').filter((l: string) => l.trim().length > 0)
    const lineCount = lines.length

    // 2. Calculate fee (x402)
    const feeUSD = lineCount * PRICE_PER_LINE
    
    // 3. Create a pending audit record
    const audit = await prisma.audit.create({
      data: {
        address: address || '0x0000000000000000000000000000000000000000',
        lineCount,
        feeUSD,
        feePaid: 0,
        status: 'payment_pending'
      }
    })
    
    return c.json({
      auditId: audit.id,
      lineCount,
      feeUSD,
      status: audit.status,
      paymentCurrency: 'USDC',
      receiverAddress: process.env.PAYMENT_RECEIVER || '0xDEAF...BEEF' 
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

/**
 * x402 MVP Flow phase 2: Finalize/Settle
 */
app.post('/api/confirm-payment', async (c) => {
  try {
    const { auditId, txHash } = await c.req.json()
    
    // In production, we'd verify the txHash on-chain using a provider (Viem/Ethers)
    // and match the amount to feeUSD.
    
    const audit = await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: 'paid',
        txHash
      }
    })

    return c.json({ 
      success: true, 
      message: 'Payment confirmed. Audit analysis starting.',
      audit 
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.get('/api/audits/:address', async (c) => {
  const address = c.req.param('address')
  const audits = await prisma.audit.findMany({
    where: { address },
    orderBy: { createdAt: 'desc' }
  })
  return c.json(audits)
})

const port = Number(process.env.PORT) || 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
