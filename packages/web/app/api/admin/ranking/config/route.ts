import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { RankingService } from "@fm/server"
import { requireRole, CAN_VIEW } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

const criterionSchema = z.object({
  id: z.string(),
  fieldKey: z.string(),
  label: z.string(),
  kind: z.enum(["numeric", "option", "boolean", "income"]),
  weight: z.number().min(0),
  enabled: z.boolean(),
  direction: z.enum(["higher", "lower"]).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  optionScores: z.record(z.string(), z.number()).optional(),
  bonus: z.number().optional(),
})

const eligibilitySchema = z.object({
  id: z.string(),
  fieldKey: z.string(),
  op: z.enum(["gte", "lte", "eq", "is_true"]),
  value: z.union([z.number(), z.string()]).optional(),
  label: z.string(),
})

const tieBreakerSchema = z.object({
  fieldKey: z.string(),
  direction: z.enum(["higher", "lower"]),
})

const incomeSchema = z.object({
  studentIncomeKey: z.string(),
  motherIncomeKey: z.string(),
  fatherIncomeKey: z.string(),
  dependentsKey: z.string(),
  motherDeceasedKey: z.string(),
  fatherDeceasedKey: z.string(),
  motherSupportsKey: z.string(),
  fatherSupportsKey: z.string(),
})

const configSchema = z.object({
  criteria: z.array(criterionSchema),
  eligibility: z.array(eligibilitySchema),
  tieBreakers: z.array(tieBreakerSchema),
  income: incomeSchema,
})

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_VIEW)
  if (!guard.ok) return guard.response

  const config = await RankingService.getConfig()
  return NextResponse.json({ success: true, data: config })
}

export async function PUT(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_VIEW)
  if (!guard.ok) return guard.response

  const parsed = configSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0].message, code: 400 }, { status: 400 })
  }

  const config = await RankingService.saveConfig(parsed.data)
  return NextResponse.json({ success: true, data: config })
}
