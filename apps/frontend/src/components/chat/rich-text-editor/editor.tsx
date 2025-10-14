import { RichText } from "@lexkit/editor";
import { Toolbar } from "./toolbar";
import { SubmitButton } from "./submit-button";
import { MentionDropdown } from "./mention-dropdown";

export const Editor = () => {
  return (
    <>
      <Toolbar />
      <RichText
        className="border p-2 rounded-md"
        placeholder={
          <div className="absolute top-2 left-2 opacity-50 pointer-events-none">
            Hello world
          </div>
        }
      />
      <MentionDropdown />
      <SubmitButton />
    </>
  );
};
