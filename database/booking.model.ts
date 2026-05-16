import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose"

import { Event } from "./event.model"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface BookingDocumentShape {
  eventId: Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

type BookingDocument = HydratedDocument<BookingDocumentShape>
type BookingModel = Model<BookingDocumentShape>

const bookingSchema = new Schema<BookingDocumentShape, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true }
)

bookingSchema.index({ eventId: 1 })

bookingSchema.pre("save", async function validateBooking(next) {
  const normalizedEmail = this.email.trim().toLowerCase()
  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return next(new Error('Field "email" must be a valid email address'))
  }
  this.email = normalizedEmail

  // Ensure every booking references an existing event document.
  if (this.isNew || this.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: this.eventId })
    if (!eventExists) {
      return next(new Error("Cannot create a booking for a non-existent event"))
    }
  }

  return next()
})

export const Booking =
  (mongoose.models.Booking as BookingModel | undefined) ??
  mongoose.model<BookingDocumentShape, BookingModel>("Booking", bookingSchema)

export type { BookingDocument }
