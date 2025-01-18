"use server";

import { createSDK, createTokenSigner } from "@hautechai/sdk";

const tokenSigner = createTokenSigner({
  appId: process.env.APP_ID!,
  appKeyId: process.env.APP_KEY_ID!,
  appKeySecret: process.env.APP_KEY_SECRET!,
});

const rootSDK = createSDK({
  authToken: () => tokenSigner.createRootToken({ expiresInSeconds: 3600 }),
  endpoint: process.env.HAUTECH_API_ENDPOINT,
});

export const getClientToken = async (): Promise<string> => {
  const userId = "example-user-id";

  let account = await rootSDK.accounts.getByAlias({ alias: userId });
  if (!account) {
    account = await rootSDK.accounts.create({ alias: userId });
  }

  const balance = await rootSDK.balances.getByAccountId({
    accountId: account.id,
  });
  if (parseInt(balance) < 100) {
    await rootSDK.balances.add({
      accountId: account.id,
      amount: "100",
    });
  }

  return tokenSigner.createAccountToken({
    accountId: account.id,
    expiresInSeconds: 3600,
  });
};
