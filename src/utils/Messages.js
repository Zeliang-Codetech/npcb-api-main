import { DonationOrderStatus } from "./Status";

const getDonationOrderMessage = (status) => {
  let message = { title: "", description: "" };
  switch (status) {
    case DonationOrderStatus.PENDING:
      message = { title: "", description: "" };
      break;
    case DonationOrderStatus.APPROVED:
      message = {
        title: "Your Request has been approved",
        description: "",
      };
      break;
    case DonationOrderStatus.REJECTED:
      message = { title: "Your Request has been rejected", description: "" };
      break;
    case DonationOrderStatus.OUT_FOR_PICKUP:
      message = { title: "Your Request is out for pickup", description: "" };
      break;
    case DonationOrderStatus.OUT_FOR_DELIVERY:
      message = { title: "Your Request is out for delivery", description: "" };
      break;
    case DonationOrderStatus.DELIVERED:
      message = { title: "Your Request has been delivered", description: "" };
      break;
    default:
  }
  return message;
};

export { getDonationOrderMessage };
