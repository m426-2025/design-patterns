interface EditorState {
  onInput(): void;
  onSave(): void;
  onSaveAs(): void;
  onNew(): void;
  onFileClick(filename: string): void;
  getLabel(): string;
}

class EditorContext {
  public textArea: HTMLTextAreaElement;
  public stateLabel: HTMLElement;
  public filesListId: string = "files-list";
  public state: EditorState;

  constructor() {
    this.textArea = document.getElementById("text") as HTMLTextAreaElement;
    this.stateLabel = document.getElementById("state-label");
    this.state = new CleanUnsavedState(this);
    this.showFiles(listFiles());
    this.setStateLabel(this.state.getLabel());
  }

  setState(state: EditorState) {
    this.state = state;
    this.setStateLabel(this.state.getLabel());
  }

  setStateLabel(value: string) {
    this.stateLabel.innerText = value;
  }

  showFiles(files: string[]) {
    const parent = document.getElementById(this.filesListId);
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
    for (const file of files) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.innerHTML = file;
      item.appendChild(link);
      parent.append(item);
      link.addEventListener("click", () => {
        this.state.onFileClick(file);
      });
    }
  }
}

class CleanUnsavedState implements EditorState {
  constructor(private ctx: EditorContext) {}
  onInput() {
    this.ctx.setState(new DirtyUnsavedState(this.ctx));
  }
  onSave() {
    let filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() !== "") {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, this.ctx.textArea.value);
      this.ctx.setState(new CleanSavedState(this.ctx, filename));
      this.ctx.showFiles(listFiles());
    }
  }
  onSaveAs() {
    this.onSave();
  }
  onNew() {
    this.ctx.textArea.value = "";
    this.ctx.setState(new CleanUnsavedState(this.ctx));
  }
  onFileClick(filename: string) {
    const content = localStorage.getItem(filename);
    this.ctx.textArea.value = content;
    this.ctx.setState(new CleanSavedState(this.ctx, filename));
  }
  getLabel() {
    return "_";
  }
}

class CleanSavedState implements EditorState {
  constructor(private ctx: EditorContext, private filename: string) {}
  onInput() {
    this.ctx.setState(new DirtySavedState(this.ctx, this.filename));
  }
  onSave() {
    localStorage.setItem(this.filename, this.ctx.textArea.value);
    this.ctx.setState(new CleanSavedState(this.ctx, this.filename));
    this.ctx.showFiles(listFiles());
  }
  onSaveAs() {
    let filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() !== "") {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, this.ctx.textArea.value);
      this.ctx.setState(new CleanSavedState(this.ctx, filename));
      this.ctx.showFiles(listFiles());
    }
  }
  onNew() {
    this.ctx.textArea.value = "";
    this.ctx.setState(new CleanUnsavedState(this.ctx));
  }
  onFileClick(filename: string) {
    const content = localStorage.getItem(filename);
    this.ctx.textArea.value = content;
    this.ctx.setState(new CleanSavedState(this.ctx, filename));
  }
  getLabel() {
    return this.filename;
  }
}

class DirtyUnsavedState implements EditorState {
  constructor(private ctx: EditorContext) {}
  onInput() {
    // bleibt im gleichen Zustand
  }
  onSave() {
    let filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() !== "") {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, this.ctx.textArea.value);
      this.ctx.setState(new CleanSavedState(this.ctx, filename));
      this.ctx.showFiles(listFiles());
    }
  }
  onSaveAs() {
    this.onSave();
  }
  onNew() {
    this.ctx.textArea.value = "";
    this.ctx.setState(new CleanUnsavedState(this.ctx));
  }
  onFileClick(filename: string) {
    const content = localStorage.getItem(filename);
    this.ctx.textArea.value = content;
    this.ctx.setState(new CleanSavedState(this.ctx, filename));
  }
  getLabel() {
    return "*";
  }
}

class DirtySavedState implements EditorState {
  constructor(private ctx: EditorContext, private filename: string) {}
  onInput() {
    // bleibt im gleichen Zustand
  }
  onSave() {
    localStorage.setItem(this.filename, this.ctx.textArea.value);
    this.ctx.setState(new CleanSavedState(this.ctx, this.filename));
    this.ctx.showFiles(listFiles());
  }
  onSaveAs() {
    let filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() !== "") {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, this.ctx.textArea.value);
      this.ctx.setState(new CleanSavedState(this.ctx, filename));
      this.ctx.showFiles(listFiles());
    }
  }
  onNew() {
    this.ctx.textArea.value = "";
    this.ctx.setState(new CleanUnsavedState(this.ctx));
  }
  onFileClick(filename: string) {
    const content = localStorage.getItem(filename);
    this.ctx.textArea.value = content;
    this.ctx.setState(new CleanSavedState(this.ctx, filename));
  }
  getLabel() {
    return `${this.filename} *`;
  }
}

function listFiles(): string[] {
  const files: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    files.push(localStorage.key(i));
  }
  return files;
}

document.addEventListener("DOMContentLoaded", () => {
  const ctx = new EditorContext();

  ctx.textArea.addEventListener("input", () => {
    ctx.state.onInput();
    ctx.setStateLabel(ctx.state.getLabel());
  });

  document.getElementById("save-as-button").addEventListener("click", () => {
    ctx.state.onSaveAs();
    ctx.setStateLabel(ctx.state.getLabel());
  });

  document.getElementById("save-button").addEventListener("click", () => {
    ctx.state.onSave();
    ctx.setStateLabel(ctx.state.getLabel());
  });

  document.getElementById("new-button").addEventListener("click", () => {
    ctx.state.onNew();
    ctx.setStateLabel(ctx.state.getLabel());
  });

  document.addEventListener("contextmenu", (event) => {
    alert("Wanna steal my source code, huh!?");
    event.preventDefault();
    return false;
  });
});
