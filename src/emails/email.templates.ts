import Transporter from "./transporter";
import { expireOTP, transporter } from "../config/env";
import { user, UserDB } from "../models/user";
// import { encodeString } from "../utils/encoding";

//* Email Sent when new Freelancer is Registered
export async function newUserMail(user: user) {
  Transporter.sendMail({
    to: user.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Welcome to EzSplit",
    html: `
      <h1>Welcome to EzSplit</h1>
      <p>Hi ${user.username},</p>
      <p>Thank you for registering with EzSplit. We are excited to have you on board.</p>
      <p>Regards,</p>
    <p>Team EzSplit</p>
      `,
  });
}

//* Email Sent when Freelancer logs in
export async function userLoginMail(user: user) {
  Transporter.sendMail({
    to: user.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Login Alert",
    html: `
        <h1>Login Alert</h1>
        <p>Hi ${user.username},</p>
        <p>Your account was logged in at ${new Date().toLocaleString()}</p>
        <p>If this was not you, please contact us immediately.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
}

//* Email Sent when user requests to reset password

//* Email send when User have to notify for Not Paid Split
export async function notPaidSplitMail(user: user,splitCreatedBy: user, splitId: string) {
  Transporter.sendMail({
    to: user.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Payment Reminder",
    html: `
        <h1>Payment Reminder</h1>
        <p>Hi ${user.username},</p>
        <p>You have an unpaid split created by ${splitCreatedBy.username} (${splitCreatedBy.profile.name}). Please pay your share.</p>
        <p>Split ID: ${splitId}</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
}

//* Email Sent on friend request [Send Email to both user and friend]
export async function FriendRequestMail(from: user, to: user) {
  Transporter.sendMail({
    to: to.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Friend Request",
    html: `
        <h1>Friend Request</h1>
        <p>Hi ${to.username},</p>
        <p>${from.username} wants to connect with you on EzSplit.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
  Transporter.sendMail({
    to: from.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Friend Request",
    html: `
        <h1>Friend Request</h1>
        <p>Hi ${from.username},</p>
        <p>Your friend request to ${to.username} has been sent.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
}

//* Email Sent when friend request accecpted [Send Email to both user and friend]
export async function FriendRequestAcceptedMail(from: user, to: user) {
  Transporter.sendMail({
    to: to.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Friend Request Accepted",
    html: `
        <h1>Friend Request Accepted</h1>
        <p>Hi ${to.username},</p>
        <p>${from.username} has accepted your friend request.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
  Transporter.sendMail({
    to: from.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Friend Request Accepted",
    html: `
        <h1>Friend Request Accepted</h1>
        <p>Hi ${from.username},</p>
        <p>You have accepted the friend request from ${to.username}.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
}

//* Email Sent when friend request rejected [Send Email to both user and friend]
export async function FriendRequestRejectedMail(from: user, to: user) {
  Transporter.sendMail({
    to: to.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Friend Request Rejected",
    html: `
        <h1>Friend Request Rejected</h1>
        <p>Hi ${to.username},</p>
        <p>${from.username} has rejected your friend request.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
  Transporter.sendMail({
    to: from.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Friend Request Rejected",
    html: `
        <h1>Friend Request Rejected</h1>
        <p>Hi ${from.username},</p>
        <p>You have rejected the friend request from ${to.username}.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
}

//* Email Sent when friend removed [Send Email to both user and friend]
export async function FriendRemovedMail(from: user, to: user) {
  Transporter.sendMail({
    to: to.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Friend Removed",
    html: `
        <h1>Friend Removed</h1>
        <p>Hi ${to.username},</p>
        <p>${from.username} has removed you from friends.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
  Transporter.sendMail({
    to: from.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Friend Removed",
    html: `
        <h1>Friend Removed</h1>
        <p>Hi ${from.username},</p>
        <p>You have removed ${to.username} from friends.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
}

//* Email Sent when user pays for a split [Send Email to both user and split creator]
export async function PaymentMail(createdby: user, payedby: user) {
  Transporter.sendMail({
    to: createdby.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Payment Received",
    html: `
        <h1>Payment Received</h1>
        <p>Hi ${createdby.username},</p>
        <p>${payedby.username} has paid for the split you created.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
  Transporter.sendMail({
    to: payedby.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Payment Successful",
    html: `
        <h1>Payment Successful</h1>
        <p>Hi ${payedby.username},</p>
        <p>Your payment for the split has been successful.</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
}

//* Email Sent when User is added to a split
export async function SplitAddedMail(user: user, splitId: string) {
  Transporter.sendMail({
    to: user.email,
    from: `Ezsplit ${transporter.auth.user}`,
    subject: "Added to Split",
    html: `
        <h1>Added to Split</h1>
        <p>Hi ${user.username},</p>
        <p>You have been added to a split.</p>
        <p>Split ID: ${splitId}</p>
        <p>Regards,</p>
        <p>Team EzSplit</p>
        `,
  });
}