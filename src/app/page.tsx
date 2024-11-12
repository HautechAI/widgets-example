"use client";

import {
  Button,
  CssBaseline,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { createWidgetsSDK, GenerateWidget } from "@hautechai/widgets";
import { createServerSDK } from "@hautechai/server";
import S from "./style";
import { useCallback, useEffect, useState } from "react";

const Application = () => {
  const [appId, setAppId] = useState("");
  const [appKeyId, setAppKeyId] = useState("");
  const [appKeySecret, setAppKeySecret] = useState("");
  const [showWidget, setShowWidget] = useState(false);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [widget, setWidget] = useState<GenerateWidget>();

  useEffect(() => {
    if (showWidget) {
      // Server side
      const serverSDK = createServerSDK({
        appId,
        appKeyId,
        appKeySecret,
      });

      const getClientToken = async (): Promise<string> => {
        const userId = "example";

        let account = await serverSDK.root.accounts.getByExternalId({
          id: userId,
        });
        if (!account) {
          account = await serverSDK.root.accounts.create({
            externalId: userId,
          });
        }

        if (parseInt(account.balance) < 100) {
          await serverSDK.root.balances.add({
            accountId: account.id,
            balance: "100",
          });
        }

        const token = serverSDK.token.create({
          accountId: account.id,
          expiresInSeconds: 3600,
        });

        return token;
      };

      // Client side
      const sdk = createWidgetsSDK({
        authToken: async () => getClientToken(),
      });

      const loadWidget = async () => {
        const container = document.getElementById("widget-container");
        if (!container || container.children.length > 0) return;

        const widget = sdk.widgets.generate();
        widget.setHandlers({
          downloadImage: async (props: { imageId: string }) => {
            const images = await sdk.client.images.getUrls({
              ids: [props.imageId],
            });
            const imageUrl = images[props.imageId];
            setImageUrls((imageUrls) => [...imageUrls, imageUrl]);
          },
        });
        widget.attach(container);

        const collection = await sdk.client.collections.create();
        const imageUrl =
          "https://cdn.preview.hautech.ai/dca18ac7-ae93-46b9-84ec-628f3e41f292.jpg";
        const image = await sdk.client.images.create({ url: imageUrl });

        await widget.ready();
        await widget.setProps({
          collectionId: collection.id,
          input: {
            productImageId: image.id,
            prompt:
              "Ultra realistic, high resolution photo, beautiful woman, western European, walking dressed in Sleeveless pink fitted dress, white studio background",
          },
          text: { downloadImage: "Add to gallery" },
        });

        setWidget(widget);
      };
      loadWidget();
    }
  }, [showWidget]);

  const onStart = useCallback(async () => {
    if (!widget) return;

    await widget.methods.start();
  }, [widget]);

  return (
    <S.Container>
      <CssBaseline />
      {!showWidget && (
        <Grid2 container direction="column" gap={1}>
          <Grid2>
            <TextField
              label="AppId"
              onChange={(e) => {
                setAppId(e.target.value);
              }}
              value={appId}
            />
          </Grid2>
          <Grid2>
            <TextField
              label="AppKeyId"
              onChange={(e) => {
                setAppKeyId(e.target.value);
              }}
              value={appKeyId}
            />
          </Grid2>
          <Grid2>
            <TextField
              label="AppKeySecret"
              type="password"
              onChange={(e) => {
                setAppKeySecret(e.target.value);
              }}
              value={appKeySecret}
            />
          </Grid2>
          <Button onClick={() => setShowWidget(true)} variant="outlined">
            Apply
          </Button>
        </Grid2>
      )}
      {showWidget && (
        <>
          <S.WidgetPart>
            <Typography color="primary" variant="h5">
              Widget
            </Typography>
            <S.WidgetContainer id="widget-container" />
            <Button onClick={onStart} variant="outlined">
              Generate
            </Button>
          </S.WidgetPart>
          <S.ImagePart>
            <Typography color="primary" variant="h5">
              Images
            </Typography>
            <S.Images>
              {imageUrls.map((imageUrl, index) => (
                <S.Image key={index} src={imageUrl} />
              ))}
            </S.Images>
          </S.ImagePart>
        </>
      )}
    </S.Container>
  );
};

export default Application;
