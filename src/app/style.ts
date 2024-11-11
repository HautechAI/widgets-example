import { styled } from "@mui/material/styles";

const style = {
  Container: styled("div")`
    display: flex;
    flex-direction: row;
    height: 100%;
    gap: 16px;
    padding: 32px;
    width: 100%;
  `,
  Image: styled("img")`
    height: 128px;
    width: auto;
  `,
  Images: styled("div")`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  `,
  ImagePart: styled("div")`
    align-items: center;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    gap: 16px;
  `,
  WidgetContainer: styled("div")`
    border: 1px solid lightgray;
    height: 600px;
    width: 400px;
  `,
  WidgetPart: styled("div")`
    align-items: center;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
  `,
};

export default style;
