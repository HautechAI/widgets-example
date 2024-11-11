"use client";

import { Button, CssBaseline, Typography } from "@mui/material";
import { createWidgetsSDK, GenerateWidget } from "@hautechai/widgets";
import { getClientToken } from "./sdk";
import S from "./style";
import { useCallback, useEffect, useState } from "react";

const sdk = createWidgetsSDK({
  authToken: async () => getClientToken(),

  // This lines is just for local testing. You don't need to use it
  endpoints: {
    client: process.env.NEXT_PUBLIC_HAUTECH_API_ENDPOINT,
    widgets: process.env.NEXT_PUBLIC_HAUTECH_WIDGETS_ENDPOINT,
  },
});

const Application = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [widget, setWidget] = useState<GenerateWidget>();

  useEffect(() => {
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
        "https://www.collinsdictionary.com/images/thumb/dress_31690953_250.jpg";
      const image = await sdk.client.images.create({ url: imageUrl });

      await widget.ready();
      await widget.setProps({
        collectionId: collection.id,
        input: {
          productImageId: image.id,
          prompt: "Latina woman",
        },
        text: { downloadImage: "Add to gallery" },
      });

      setWidget(widget);
    };
    loadWidget();
  }, []);

  const onStart = useCallback(async () => {
    if (!widget) return;

    await widget.methods.start();
  }, [widget]);

  return (
    <S.Container>
      <CssBaseline />
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
          {imageUrls.map((imageUrl) => (
            <S.Image key={imageUrl} src={imageUrl} />
          ))}
        </S.Images>
      </S.ImagePart>
    </S.Container>
  );
};

export default Application;
