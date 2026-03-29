import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ── Users ─────────────────────────────────────────────────────────────────
  users: defineTable({
    authProvider:      v.union(v.literal('anonymous'), v.literal('email'), v.literal('github')),
    email:             v.optional(v.string()),
    githubId:          v.optional(v.string()),
    displayName:       v.optional(v.string()),
    avatarUrl:         v.optional(v.string()),
    themePreference:   v.union(v.literal('dark'), v.literal('light'), v.literal('system')),
    accentPreference:  v.string(),
    aiRequestsToday:   v.number(),
    aiRequestsDate:    v.string(), // ISO date YYYY-MM-DD
  })
    .index('by_email', ['email'])
    .index('by_github_id', ['githubId']),

  // ── Content (synced from PayloadCMS) ──────────────────────────────────────
  languages: defineTable({
    payloadId:    v.string(),
    slug:         v.string(),
    name:         v.string(),
    description:  v.string(),
    color:        v.string(),
    order:        v.number(),
    isPublished:  v.boolean(),
  })
    .index('by_payload_id', ['payloadId'])
    .index('by_slug', ['slug'])
    .index('by_order', ['order']),

  sections: defineTable({
    payloadId:   v.string(),
    languageId:  v.id('languages'),
    title:       v.string(),
    slug:        v.string(),
    description: v.string(),
    order:       v.number(),
    isPublished: v.boolean(),
  })
    .index('by_payload_id', ['payloadId'])
    .index('by_language', ['languageId'])
    .index('by_language_order', ['languageId', 'order']),

  flashcards: defineTable({
    payloadId:      v.string(),
    sectionId:      v.id('sections'),
    question:       v.string(),
    questionType:   v.union(
      v.literal('free_recall'),
      v.literal('code_completion'),
      v.literal('explain_output'),
      v.literal('spot_error'),
      v.literal('fill_blank'),
    ),
    answer:         v.string(),
    answerCode:     v.optional(v.string()),
    explanation:    v.optional(v.string()),
    hint:           v.optional(v.string()),
    commonMistakes: v.array(v.string()),
    difficulty:     v.union(v.literal('beginner'), v.literal('intermediate'), v.literal('advanced')),
    tags:           v.array(v.string()),
    order:          v.number(),
  })
    .index('by_payload_id', ['payloadId'])
    .index('by_section', ['sectionId'])
    .index('by_section_order', ['sectionId', 'order']),

  exercises: defineTable({
    payloadId:     v.string(),
    sectionId:     v.id('sections'),
    type:          v.union(
      v.literal('fill_blank'),
      v.literal('multiple_choice'),
      v.literal('spot_error'),
      v.literal('arrange_code'),
      v.literal('translate'),
    ),
    prompt:        v.string(),
    codeTemplate:  v.optional(v.string()),
    options:       v.optional(v.any()),
    correctAnswer: v.any(),
    explanation:   v.optional(v.string()),
    order:         v.number(),
  })
    .index('by_payload_id', ['payloadId'])
    .index('by_section', ['sectionId']),

  cheatSheetEntries: defineTable({
    payloadId:    v.string(),
    languageSlug: v.string(),
    category:     v.string(),
    title:        v.string(),
    syntax:       v.string(),
    description:  v.string(),
    example:      v.optional(v.string()),
    order:        v.number(),
  })
    .index('by_payload_id', ['payloadId'])
    .index('by_language', ['languageSlug'])
    .index('by_language_category', ['languageSlug', 'category']),

  // ── User Progress ─────────────────────────────────────────────────────────
  cardProgress: defineTable({
    userId:             v.id('users'),
    flashcardId:        v.id('flashcards'),
    // SM-2 fields
    interval:           v.number(),
    repetitions:        v.number(),
    easeFactor:         v.number(),
    nextReviewAt:       v.number(), // unix ms
    lastReviewedAt:     v.number(),
    totalReviews:       v.number(),
    successfulReviews:  v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_card', ['userId', 'flashcardId'])
    .index('by_user_due', ['userId', 'nextReviewAt']),

  sectionProgress: defineTable({
    userId:          v.id('users'),
    sectionId:       v.id('sections'),
    status:          v.union(
      v.literal('locked'),
      v.literal('available'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('mastered'),
    ),
    cardsDue:        v.number(),
    cardsNew:        v.number(),
    cardsMastered:   v.number(),
    lastStudiedAt:   v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_user_section', ['userId', 'sectionId']),

  // ── Streaks ────────────────────────────────────────────────────────────────
  streaks: defineTable({
    userId:           v.id('users'),
    currentStreak:    v.number(),
    longestStreak:    v.number(),
    lastActiveDate:   v.string(), // YYYY-MM-DD
    todayCompleted:   v.boolean(),
    freezesAvailable: v.number(),
    freezesUsed:      v.number(),
    // Daily goals
    cardsTarget:               v.number(),
    perfectRecallsTarget:      v.number(),
    minutesTarget:             v.number(),
    cardsCompletedToday:       v.number(),
    perfectRecallsToday:       v.number(),
    minutesStudiedToday:       v.number(),
  })
    .index('by_user', ['userId']),

  // ── Study Sessions ─────────────────────────────────────────────────────────
  studySessions: defineTable({
    userId:           v.id('users'),
    sectionId:        v.id('sections'),
    startedAt:        v.number(),
    completedAt:      v.optional(v.number()),
    cardsReviewed:    v.number(),
    perfectRecalls:   v.number(),
    durationMs:       v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_user_date', ['userId', 'startedAt']),

  // ── Quiz Attempts ──────────────────────────────────────────────────────────
  quizAttempts: defineTable({
    userId:      v.id('users'),
    sectionId:   v.id('sections'),
    answers:     v.array(v.object({
      exerciseId: v.id('exercises'),
      answer:     v.any(),
      isCorrect:  v.boolean(),
      timeTakenMs: v.optional(v.number()),
    })),
    score:       v.number(),
    passed:      v.boolean(),
    startedAt:   v.number(),
    completedAt: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_user_section', ['userId', 'sectionId']),
});
