import { InterviewResponse } from "@open-event-systems/interview-lib"
import { Cart, CartPricingResult } from "./types.js"

export type CartAPI = {
  readEmptyCart: (eventId: string) => Promise<Cart>
  readCart: (cartId: string) => Promise<Cart>
  readCartPricingResult: (cartId: string) => Promise<CartPricingResult>
  startInterview: (
    eventId: string,
    cartId: string,
    interviewId: string,
    registrationId?: string,
  ) => Promise<InterviewResponse>
  removeRegistrationFromCart: (
    cartId: string,
    registrationId: string,
  ) => Promise<Cart>
}
