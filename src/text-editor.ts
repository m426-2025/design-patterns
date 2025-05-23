interface EditorState {
  getLabel(): string;
  onInput(editor: Editor): void;
  onSave(editor: Editor): void;
  onSaveAs(editor: Editor): void;
  onNew(editor: Editor): void;
  getFilename(): string | undefined;
  getContent(): string;
  setContent(content: string): void;
}

class Editor {
  private state: EditorState;
  private textArea: HTMLTextAreaElement;

  constructor(textArea: HTMLTextAreaElement) {
    this.textArea = textArea;
    this.state = new CleanUnsavedState("");
    this.textArea.value = "";
    setStateLabel(this.state.getLabel());
  }

  setState(state: EditorState) {
    this.state = state;
    setStateLabel(this.state.getLabel());
    this.textArea.value = this.state.getContent();
    showFiles(listFiles(), "files-list");
  }

  getState(): EditorState {
    return this.state;
  }

  getTextArea(): HTMLTextAreaElement {
    return this.textArea;
  }

  setContent(content: string) {
    this.state.setContent(content);
    this.textArea.value = content;
  }
}

class CleanUnsavedState implements EditorState {
  private content: string;
  constructor(content: string) {
    this.content = content;
  }
  getLabel(): string {
    return "_";
  }
  onInput(editor: Editor) {
    editor.setState(new DirtyUnsavedState(editor.getTextArea().value));
  }
  onSave(editor: Editor) {
    // Save as
    this.onSaveAs(editor);
  }
  onSaveAs(editor: Editor) {
    const content = editor.getTextArea().value;
    let filename = prompt("Enter a File Name", "") || "";
    if (filename.trim() !== "") {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, content);
      editor.setState(new CleanSavedState(filename, content));
    }
  }
  onNew(editor: Editor) {
    editor.setState(new CleanUnsavedState(""));
  }
  getFilename() {
    return undefined;
  }
  getContent() {
    return this.content;
  }
  setContent(content: string) {
    this.content = content;
  }
}

class DirtyUnsavedState implements EditorState {
  private content: string;
  constructor(content: string) {
    this.content = content;
  }
  getLabel(): string {
    return "*";
  }
  onInput(editor: Editor) {
    this.content = editor.getTextArea().value;
  }
  onSave(editor: Editor) {
    this.onSaveAs(editor);
  }
  onSaveAs(editor: Editor) {
    const content = editor.getTextArea().value;
    let filename = prompt("Enter a File Name", "") || "";
    if (filename.trim() !== "") {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, content);
      editor.setState(new CleanSavedState(filename, content));
    }
  }
  onNew(editor: Editor) {
    editor.setState(new CleanUnsavedState(""));
  }
  getFilename() {
    return undefined;
  }
  getContent() {
    return this.content;
  }
  setContent(content: string) {
    this.content = content;
  }
}

class CleanSavedState implements EditorState {
  private filename: string;
  private content: string;
  constructor(filename: string, content: string) {
    this.filename = filename;
    this.content = content;
  }
  getLabel(): string {
    return this.filename;
  }
  onInput(editor: Editor) {
    editor.setState(
      new DirtySavedState(this.filename, editor.getTextArea().value)
    );
  }
  onSave(editor: Editor) {
    localStorage.setItem(this.filename, editor.getTextArea().value);
    editor.setState(
      new CleanSavedState(this.filename, editor.getTextArea().value)
    );
  }
  onSaveAs(editor: Editor) {
    const content = editor.getTextArea().value;
    let filename = prompt("Enter a File Name", "") || "";
    if (filename.trim() !== "") {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, content);
      editor.setState(new CleanSavedState(filename, content));
    }
  }
  onNew(editor: Editor) {
    editor.setState(new CleanUnsavedState(""));
  }
  getFilename() {
    return this.filename;
  }
  getContent() {
    return this.content;
  }
  setContent(content: string) {
    this.content = content;
  }
}

class DirtySavedState implements EditorState {
  private filename: string;
  private content: string;
  constructor(filename: string, content: string) {
    this.filename = filename;
    this.content = content;
  }
  getLabel(): string {
    return `${this.filename} *`;
  }
  onInput(editor: Editor) {
    this.content = editor.getTextArea().value;
  }
  onSave(editor: Editor) {
    localStorage.setItem(this.filename, editor.getTextArea().value);
    editor.setState(
      new CleanSavedState(this.filename, editor.getTextArea().value)
    );
  }
  onSaveAs(editor: Editor) {
    const content = editor.getTextArea().value;
    let filename = prompt("Enter a File Name", "") || "";
    if (filename.trim() !== "") {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, content);
      editor.setState(new CleanSavedState(filename, content));
    }
  }
  onNew(editor: Editor) {
    editor.setState(new CleanUnsavedState(""));
  }
  getFilename() {
    return this.filename;
  }
  getContent() {
    return this.content;
  }
  setContent(content: string) {
    this.content = content;
  }
}

const textArea = document.getElementById("text") as HTMLTextAreaElement;
const editor = new Editor(textArea);

document.addEventListener("DOMContentLoaded", () => {
  showFiles(listFiles(), "files-list");
  textArea.addEventListener("input", () => {
    editor.getState().onInput(editor);
    setStateLabel(editor.getState().getLabel());
  });
  const saveAsButton = document.getElementById("save-as-button");
  saveAsButton.addEventListener("click", () => {
    editor.getState().onSaveAs(editor);
  });
  const saveButton = document.getElementById("save-button");
  saveButton.addEventListener("click", () => {
    editor.getState().onSave(editor);
  });
  const newButton = document.getElementById("new-button");
  newButton.addEventListener("click", () => {
    editor.getState().onNew(editor);
  });
  document.addEventListener("contextmenu", (event) => {
    alert("Wanna steal my source code, huh!?");
    event.preventDefault();
    return false;
  });
});

function setStateLabel(value: string) {
  const stateLabel = document.getElementById("state-label");
  stateLabel.innerText = value;
}

function showFiles(files: string[], parentId: string) {
  const parent = document.getElementById(parentId);
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
      const content = localStorage.getItem(file) || "";
      editor.setState(new CleanSavedState(file, content));
    });
  }
}

function listFiles(): string[] {
  const files: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    files.push(localStorage.key(i));
  }
  return files;
}
