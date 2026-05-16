import mongoose, { HydratedDocument, Model, Schema } from "mongoose"

const REQUIRED_STRING_FIELDS = [
  "title",
  "description",
  "overview",
  "image",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
] as const

type RequiredStringField = (typeof REQUIRED_STRING_FIELDS)[number]

export interface EventDocumentShape {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  date: string
  time: string
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

type EventDocument = HydratedDocument<EventDocumentShape>
type EventModel = Model<EventDocumentShape>

const isNonEmptyStringArray = (value: string[]): boolean =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((item) => typeof item === "string" && item.trim().length > 0)

const slugifyTitle = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const normalizeDateToIso = (value: string): string | null => {
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate.toISOString()
}

const normalizeTime = (value: string): string | null => {
  const cleanedValue = value.trim().toLowerCase().replace(/\./g, "")

  const twelveHourMatch = cleanedValue.match(
    /^(\d{1,2})(?::([0-5]\d))?\s*([ap]m)$/
  )
  if (twelveHourMatch) {
    const hour = Number(twelveHourMatch[1])
    const minute = Number(twelveHourMatch[2] ?? "0")
    const meridiem = twelveHourMatch[3]

    if (hour < 1 || hour > 12) {
      return null
    }

    const hour24 = (hour % 12) + (meridiem === "pm" ? 12 : 0)
    return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
  }

  const twentyFourHourMatch = cleanedValue.match(/^([01]?\d|2[0-3]):([0-5]\d)$/)
  if (!twentyFourHourMatch) {
    return null
  }

  const hour = Number(twentyFourHourMatch[1])
  const minute = Number(twentyFourHourMatch[2])

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

const eventSchema = new Schema<EventDocumentShape, EventModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: isNonEmptyStringArray,
        message: "Agenda must contain at least one non-empty entry",
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: isNonEmptyStringArray,
        message: "Tags must contain at least one non-empty entry",
      },
    },
  },
  { timestamps: true }
)

eventSchema.index({ slug: 1 }, { unique: true })

eventSchema.pre("save", function normalizeAndValidateEvent(next) {
  for (const field of REQUIRED_STRING_FIELDS) {
    const value = this[field as RequiredStringField]
    if (typeof value !== "string" || value.trim().length === 0) {
      return next(new Error(`Field "${field}" is required and cannot be empty`))
    }
  }

  if (!isNonEmptyStringArray(this.agenda)) {
    return next(
      new Error('Field "agenda" must contain at least one non-empty item')
    )
  }

  if (!isNonEmptyStringArray(this.tags)) {
    return next(new Error('Field "tags" must contain at least one non-empty item'))
  }

  // Regenerate the slug only when the title changes.
  if (this.isModified("title")) {
    const generatedSlug = slugifyTitle(this.title)
    if (!generatedSlug) {
      return next(new Error("Unable to generate slug from title"))
    }
    this.slug = generatedSlug
  }

  // Keep date and time in canonical formats for consistent querying/filtering.
  if (this.isModified("date")) {
    const normalizedDate = normalizeDateToIso(this.date)
    if (!normalizedDate) {
      return next(new Error('Field "date" must be a valid date value'))
    }
    this.date = normalizedDate
  }

  if (this.isModified("time")) {
    const normalizedTime = normalizeTime(this.time)
    if (!normalizedTime) {
      return next(new Error('Field "time" must be in a valid time format'))
    }
    this.time = normalizedTime
  }

  // Store cleaned array values to avoid accidental whitespace-only entries.
  this.agenda = this.agenda.map((item) => item.trim())
  this.tags = this.tags.map((item) => item.trim())

  return next()
})

export const Event =
  (mongoose.models.Event as EventModel | undefined) ??
  mongoose.model<EventDocumentShape, EventModel>("Event", eventSchema)

export type { EventDocument }
