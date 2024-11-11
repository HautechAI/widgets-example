"use server";

import { createServerSDK } from "@hautechai/server";

console.log("----");
console.log(process.env);

const serverSDK = createServerSDK({
  appId: process.env.APP_ID!,
  appKeyId: process.env.APP_KEY_ID!,
  appKeySecret: process.env.APP_KEY_SECRET!,

  // This line is just for local testing. You don't need to use it
  endpoint: process.env.HAUTECH_API_ENDPOINT!,
});

export const getClientToken = async (): Promise<string> => {
  const userId = "example";

  let account = await serverSDK.root.accounts.getByExternalId({ id: userId });
  if (!account) {
    account = await serverSDK.root.accounts.create({ externalId: userId });
  }

  if (parseInt(account.balance) < 100) {
    await serverSDK.root.balances.add({
      accountId: account.id,
      balance: "100",
    });
  }

  return serverSDK.token.create({
    accountId: account.id,
    expiresInSeconds: 3600,
  });
};
