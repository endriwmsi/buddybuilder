import { db } from "./prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { getValidDomains, normalizeName } from "./utils";
import { sendEmailAction } from "@/actions/send-email.action";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      await sendEmailAction({
        to: user.email,
        subject: "Redefinir senha",
        meta: {
          description: "Clique no link abaixo para redefinir sua senha.",
          link: String(url),
        },
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,

    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set("callbackURL", "/auth/verify");

      await sendEmailAction({
        to: user.email,
        subject: "Verifique seu e-mail",
        meta: {
          description:
            "Por favor, clique no link abaixo para verificar seu e-mail.",
          link: String(link),
        },
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = String(ctx.body.email);
        const domain = email.split("@")[1];

        const VALID_DOMAINS = getValidDomains();

        if (!VALID_DOMAINS.includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            message: "Domínio inválido. Por favor, use um domínio válido.",
          });
        }

        const name = normalizeName(ctx.body.name);

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name,
            },
          },
        };
      }
    }),
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"],
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24, // 1 days
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [nextCookies()],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
