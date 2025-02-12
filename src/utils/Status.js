const PaymentStatus = Object.freeze({
  UNPAID: 0,
  PAID: 1,
  PARTIAL: 2,
  REFUNDED: 3,
});
const UserRole = Object.freeze({});
const BookingStatus = Object.freeze({
  PENDING: 0,
  CONFIRMED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  CANCELLED: 4,
});

const PaymentMode = Object.freeze({
  CASH: 1,
  ONLINE: 2,
});
const ConversationContext = Object.freeze({
  NEW_REQUEST: "new-request",
  MENU_SELECTION: "menu-selection",
  BOOKING_DATE_SELECTION: "admin-requested-booking-date",
  ADDRESS_SELECTION: "address-selection",
  BOOKING_CONFIRMATION: "booking-confirmation",
  BOOKING_CONFIRMED: "booking-confirmed",
  BOOKING_CANCELLED: "booking-cancelled",
  PAYMENT_TYPE_SELECTION: "payment-type-selection",
  PAYMENT_REQUEST: "payment-request",
  PAYMENT_SUCCESS: "payment-success",
  PAYMENT_FAILED: "payment-failed",
  // PICKUP_LOCATION: "admin-requested-pickup-location",
  // DESTINATION_LOCATION: "admin-requested-destination-location",
  // SUPPORT: "support",
  // CANCEL_REQUEST: "cancel-request",
});

const PhonepeStatus = Object.freeze({
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
  PAYMENT_ERROR: "PAYMENT_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  AUTHORIZATION_FAILED: "AUTHORIZATION_FAILED",
});
export {
  PaymentStatus,
  UserRole,
  BookingStatus,
  PaymentMode,
  ConversationContext,
  PhonepeStatus,
};
