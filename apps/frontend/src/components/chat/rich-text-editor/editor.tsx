import { RichText } from "@lexkit/editor";
import { Toolbar } from "./toolbar";
import { SubmitButton } from "./submit-button";

export const Editor = () => {
  return (
    <>
      <Toolbar />
      <RichText />
      <SubmitButton />
    </>
  );
};
