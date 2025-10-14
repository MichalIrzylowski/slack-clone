import { MenuOption as MenuOptionCore } from "@lexical/react/LexicalTypeaheadMenuPlugin";

export class MenuOption extends MenuOptionCore {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    super(`${name} (${id})`);
    this.name = name;
    this.id = id;
  }
}
