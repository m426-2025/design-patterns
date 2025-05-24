enum State {
  CleanUnsaved,
  CleanSaved,
  DirtyUnsaved,
  DirtySaved,
}

function getAllFiles(): string[] {
  const result: string[] = [];
  for (let idx = 0; idx < localStorage.length; idx++) {
    const key = localStorage.key(idx);
    if (key) result.push(key);
  }
  return result;
}

function renderFileList(files: string[], containerId: string, editor: EditorContext) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  files.forEach(file => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = file;
    a.href = "#";
    a.onclick = e => {
      e.preventDefault();
      editor.loadFile(file);
    };
    li.appendChild(a);
    container.appendChild(li);
  });
}

// State-Interface
interface EditorState {
  onInput(ctx: EditorContext): void;
  onSave(ctx: EditorContext): void;
  onSaveAs(ctx: EditorContext): void;
  onNew(ctx: EditorContext): void;
  onOpen(ctx: EditorContext, filename: string, content: string): void;
  label(): string;
  filename(): string | undefined;
}

// Context-Klasse
class EditorContext {
  public textarea: HTMLTextAreaElement;
  public state: EditorState;

  constructor() {
    this.textarea = document.getElementById("text") as HTMLTextAreaElement;
    this.state = new UnsavedClean();
    this.textarea.addEventListener("input", () => this.state.onInput(this));
    document.getElementById("save-button")?.addEventListener("click", () => this.state.onSave(this));
    document.getElementById("save-as-button")?.addEventListener("click", () => this.state.onSaveAs(this));
    document.getElementById("new-button")?.addEventListener("click", () => this.state.onNew(this));
    this.updateFileList();
    this.updateLabel();
  }

  setState(state: EditorState) {
    this.state = state;
    this.updateLabel();
  }

  updateLabel() {
    const label = document.getElementById("state-label");
    if (label) label.textContent = this.state.label();
  }

  updateFileList() {
    renderFileList(getAllFiles(), "files-list", this);
  }

  loadFile(filename: string) {
    const content = localStorage.getItem(filename);
    if (content !== null) {
      this.state.onOpen(this, filename, content);
    }
  }

  get currentFilename() {
    return this.state.filename();
  }
}

// Konkrete States
class UnsavedClean implements EditorState {
  onInput(ctx: EditorContext) {
    ctx.setState(new UnsavedDirty());
  }
  onSave(ctx: EditorContext) {
    this.onSaveAs(ctx);
  }
  onSaveAs(ctx: EditorContext) {
    const val = ctx.textarea.value;
    let fname = prompt("Enter a File Name", "");
    if (fname && fname.trim()) {
      if (!fname.endsWith(".txt")) fname += ".txt";
      localStorage.setItem(fname, val);
      ctx.setState(new SavedClean(fname));
      ctx.updateFileList();
    }
  }
  onNew(ctx: EditorContext) {
    ctx.textarea.value = "";
    ctx.setState(new UnsavedClean());
  }
  onOpen(ctx: EditorContext, filename: string, content: string) {
    ctx.textarea.value = content;
    ctx.setState(new SavedClean(filename));
  }
  label() { return "_"; }
  filename() { return undefined; }
}

class SavedClean implements EditorState {
  constructor(private fname: string) {}
  onInput(ctx: EditorContext) {
    ctx.setState(new SavedDirty(this.fname));
  }
  onSave(ctx: EditorContext) {
    localStorage.setItem(this.fname, ctx.textarea.value);
    ctx.setState(new SavedClean(this.fname));
    ctx.updateFileList();
  }
  onSaveAs(ctx: EditorContext) {
    const val = ctx.textarea.value;
    let fname = prompt("Enter a File Name", this.fname);
    if (fname && fname.trim()) {
      if (!fname.endsWith(".txt")) fname += ".txt";
      localStorage.setItem(fname, val);
      ctx.setState(new SavedClean(fname));
      ctx.updateFileList();
    }
  }
  onNew(ctx: EditorContext) {
    ctx.textarea.value = "";
    ctx.setState(new UnsavedClean());
  }
  onOpen(ctx: EditorContext, filename: string, content: string) {
    ctx.textarea.value = content;
    ctx.setState(new SavedClean(filename));
  }
  label() { return this.fname; }
  filename() { return this.fname; }
}

class UnsavedDirty implements EditorState {
  onInput(ctx: EditorContext) {}
  onSave(ctx: EditorContext) {
    this.onSaveAs(ctx);
  }
  onSaveAs(ctx: EditorContext) {
    const val = ctx.textarea.value;
    let fname = prompt("Enter a File Name", "");
    if (fname && fname.trim()) {
      if (!fname.endsWith(".txt")) fname += ".txt";
      localStorage.setItem(fname, val);
      ctx.setState(new SavedClean(fname));
      ctx.updateFileList();
    }
  }
  onNew(ctx: EditorContext) {
    ctx.textarea.value = "";
    ctx.setState(new UnsavedClean());
  }
  onOpen(ctx: EditorContext, filename: string, content: string) {
    ctx.textarea.value = content;
    ctx.setState(new SavedClean(filename));
  }
  label() { return "*"; }
  filename() { return undefined; }
}

class SavedDirty implements EditorState {
  constructor(private fname: string) {}
  onInput(ctx: EditorContext) {}
  onSave(ctx: EditorContext) {
    localStorage.setItem(this.fname, ctx.textarea.value);
    ctx.setState(new SavedClean(this.fname));
    ctx.updateFileList();
  }
  onSaveAs(ctx: EditorContext) {
    const val = ctx.textarea.value;
    let fname = prompt("Enter a File Name", this.fname);
    if (fname && fname.trim()) {
      if (!fname.endsWith(".txt")) fname += ".txt";
      localStorage.setItem(fname, val);
      ctx.setState(new SavedClean(fname));
      ctx.updateFileList();
    }
  }
  onNew(ctx: EditorContext) {
    ctx.textarea.value = "";
    ctx.setState(new UnsavedClean());
  }
  onOpen(ctx: EditorContext, filename: string, content: string) {
    ctx.textarea.value = content;
    ctx.setState(new SavedClean(filename));
  }
  label() { return `${this.fname} *`; }
  filename() { return this.fname; }
}

// Initialisierung
document.addEventListener("DOMContentLoaded", () => {
  new EditorContext();
  document.addEventListener("contextmenu", e => {
    alert("Wanna steal my source code, huh!?");
    e.preventDefault();
    return false;
  });
});
