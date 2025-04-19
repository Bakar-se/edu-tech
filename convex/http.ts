import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Clerk webhook request could not be verified");
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  if (!event) {
    return new Response("could not validate clerk payload", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated":
      console.log(`ℹ️ Handling ${event.type} for Clerk ID: ${event.data.id}`);

      if (!event.data.public_metadata?.role) {
        console.warn(
          `⚠️ No role found in Clerk metadata for user ${event.data.id}`
        );
        return new Response("Missing role in metadata", { status: 400 });
      }
      switch (event.data.public_metadata?.role) {
        case "admin": {
          const existingAdmin = await ctx.runQuery(internal.user.getAdmins, {
            clerkId: event.data.id,
          });
          if (!existingAdmin) {
            await ctx.runMutation(internal.user.createAdmin, {
              username: `${event.data.username}`,
              clerkId: event.data.id,
            });
            console.log(`✅ Created admin: ${event.data.username}`);
          }
          break;
        }

        case "student": {
          const existingStudent = await ctx.runQuery(internal.user.getStudent, {
            clerkId: event.data.id,
          });
          if (!existingStudent) {
            await ctx.runMutation(internal.user.createStudent, {
              username: `${event.data.username}`,
              clerkId: event.data.id,
              name: `${event.data.first_name} ${event.data.last_name}`,
              email: event.data.email_addresses[0].email_address,
              img: `${event.data.image_url}`,
              studentId: event.data.id,
            });
            console.log(`✅ Created student: ${event.data.username}`);
          }
          break;
        }

        case "teacher": {
          const existingTeacher = await ctx.runQuery(internal.user.getTeacher, {
            clerkId: event.data.id,
          });
          if (!existingTeacher) {
            await ctx.runMutation(internal.user.createTeacher, {
              username: `${event.data.username}`,
              clerkId: event.data.id,
              name: `${event.data.first_name} ${event.data.last_name}`,
              email: event.data.email_addresses[0].email_address,
              img: event.data.image_url,
              teacherId: event.data.id,
            });
            console.log(`✅ Created teacher: ${event.data.username}`);
          }
          break;
        }

        case "parent": {
          const existingParent = await ctx.runQuery(internal.user.getParent, {
            clerkId: event.data.id,
          });
          if (!existingParent) {
            await ctx.runMutation(internal.user.createParent, {
              username: `${event.data.username}`,
              clerkId: event.data.id,
              name: `${event.data.first_name} ${event.data.last_name}`,
              email: event.data.email_addresses[0].email_address,
              img: `${event.data.image_url}`,
              parentId: event.data.id,
            });
            console.log(`✅ Created parent: ${event.data.username}`);
          }
          break;
        }

        default:
          console.warn(
            `⚠️ Unrecognized role "${event.data.public_metadata?.role}" for user ${event.data.id}`
          );
      }
      break;
    case "user.deleted": {
      const clerkId = event.data.id;

      if (!clerkId) {
        console.warn("⚠️ Missing Clerk ID in deleted event");
        return new Response("Missing Clerk ID", { status: 400 });
      }

      await ctx.runMutation(internal.user.deleteAdminIfExists, { clerkId });
      await ctx.runMutation(internal.user.deleteStudentIfExists, { clerkId });
      await ctx.runMutation(internal.user.deleteTeacherIfExists, { clerkId });
      await ctx.runMutation(internal.user.deleteParentIfExists, { clerkId });

      console.log(`✅ Deleted user from all roles for Clerk ID: ${clerkId}`);
      break;
    }

    default:
      console.warn(`⚠️ Unhandled webhook event: ${event.type}`);
  }
  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
