// src/text-editor.ts

// Helper functions (können auch Teil der TextEditor-Klasse sein oder bleiben global)
function listFiles(): string[] {
  const files: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) { // Sicherstellen, dass key nicht null ist
        files.push(key);
    }
  }
  return files;
}

function showFiles(files: string[], parentId: string, editor: TextEditor) {
  const parent = document.getElementById(parentId);
  if (!parent) return;

  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild!);
  }
  for (const file of files) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.innerHTML = file;
    link.href = "#"; // Für bessere Semantik und Fokusierbarkeit
    item.appendChild(link);
    parent.append(item);
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Verhindert das Springen zum Seitenanfang
      editor.openNamedFile(file);
    });
  }
}

// State Interface
interface EditorState {
  handleInput(editor: TextEditor): void;
  save(editor: TextEditor): void;
  saveAs(editor: TextEditor): void;
  newFile(editor: TextEditor): void;
  openFile(editor: TextEditor, filename: string, content: string): void;
  getLabel(): string;
  getFilename(): string | undefined; // Um den Dateinamen aus dem Zustand zu bekommen
}

// Context Class
class TextEditor {
  public textArea: HTMLTextAreaElement;
  public currentState: EditorState;
  // openFile wird jetzt vom Zustand gehandhabt oder ist Teil des Zustands
  // public openFile: string | undefined = undefined; // Nicht mehr hier als primäre Quelle

  constructor() {
    this.textArea = document.getElementById("text") as HTMLTextAreaElement;
    this.setState(new CleanUnsavedState()); // Initial state

    // Event Listeners
    this.textArea.addEventListener("input", () => this.currentState.handleInput(this));
    
    const saveAsButton = document.getElementById("save-as-button");
    saveAsButton?.addEventListener("click", () => this.currentState.saveAs(this));

    const saveButton = document.getElementById("save-button");
    saveButton?.addEventListener("click", () => this.currentState.save(this));

    const newButton = document.getElementById("new-button");
    newButton?.addEventListener("click", () => this.currentState.newFile(this));
    
    this.refreshFilesList(); // Initiale Dateiliste anzeigen
  }

  public setState(newState: EditorState): void {
    this.currentState = newState;
    this.updateStateLabel();
  }

  public updateStateLabel(): void {
    const stateLabel = document.getElementById("state-label");
    if (stateLabel) {
      stateLabel.innerText = this.currentState.getLabel();
    }
  }

  public refreshFilesList(): void {
    showFiles(listFiles(), "files-list", this);
  }
  
  public openNamedFile(filename: string): void {
    const content = localStorage.getItem(filename);
    if (content !== null) {
        this.currentState.openFile(this, filename, content);
    } else {
        console.error(`Datei ${filename} konnte nicht im localStorage gefunden werden.`);
        // Optional: Benutzer benachrichtigen
    }
  }

  public get currentFilename(): string | undefined {
    return this.currentState.getFilename();
  }
}

// Concrete States

class CleanUnsavedState implements EditorState {
  handleInput(editor: TextEditor): void {
    editor.setState(new DirtyUnsavedState());
  }
  save(editor: TextEditor): void {
    // Bei CleanUnsaved löst "Save" dasselbe aus wie "Save As", da kein Dateiname existiert.
    this.saveAs(editor);
  }
  saveAs(editor: TextEditor): void {
    const content = editor.textArea.value;
    let filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() !== "") {
      if (!filename.endsWith(".txt")) {
        filename = filename + ".txt";
      }
      localStorage.setItem(filename, content);
      editor.setState(new CleanSavedState(filename));
      editor.refreshFilesList();
    }
  }
  newFile(editor: TextEditor): void {
    editor.textArea.value = "";
    // Bleibt im CleanUnsavedState oder setzt explizit neu
    editor.setState(new CleanUnsavedState());
  }
  openFile(editor: TextEditor, filename: string, content: string): void {
    editor.textArea.value = content;
    editor.setState(new CleanSavedState(filename));
  }
  getLabel(): string {
    return "_"; // Oder "[Untitled]"
  }
  getFilename(): string | undefined {
    return undefined;
  }
}

class CleanSavedState implements EditorState {
  constructor(private filename: string) {}

  handleInput(editor: TextEditor): void {
    editor.setState(new DirtySavedState(this.filename));
  }
  save(editor: TextEditor): void {
    // Erneut speichern, auch wenn sauber (gemäß Originalverhalten)
    localStorage.setItem(this.filename, editor.textArea.value);
    // Bleibt CleanSavedState, keine Zustandsänderung nötig, außer zur Bestätigung
    editor.setState(new CleanSavedState(this.filename)); 
    editor.refreshFilesList(); // Falls Dateiliste sich irgendwie ändern könnte (hier nicht der Fall)
  }
  saveAs(editor: TextEditor): void {
    const content = editor.textArea.value;
    let newFilename = prompt("Enter a File Name", this.filename);
    if (newFilename && newFilename.trim() !== "") {
      if (!newFilename.endsWith(".txt")) {
        newFilename = newFilename + ".txt";
      }
      // Wenn der Name derselbe ist, ist es wie ein normales Speichern
      if (newFilename === this.filename) {
          localStorage.setItem(this.filename, content);
          editor.setState(new CleanSavedState(this.filename));
      } else {
          localStorage.setItem(newFilename, content);
          editor.setState(new CleanSavedState(newFilename));
      }
      editor.refreshFilesList();
    }
  }
  newFile(editor: TextEditor): void {
    editor.textArea.value = "";
    editor.setState(new CleanUnsavedState());
  }
  openFile(editor: TextEditor, filename: string, content: string): void {
    editor.textArea.value = content;
    editor.setState(new CleanSavedState(filename));
  }
  getLabel(): string {
    return this.filename;
  }
  getFilename(): string | undefined {
    return this.filename;
  }
}

class DirtyUnsavedState implements EditorState {
  handleInput(editor: TextEditor): void {
    // Bleibt DirtyUnsaved
  }
  save(editor: TextEditor): void {
    // Wie Save As, da kein Dateiname existiert
    this.saveAs(editor);
  }
  saveAs(editor: TextEditor): void {
    const content = editor.textArea.value;
    let filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() !== "") {
      if (!filename.endsWith(".txt")) {
        filename = filename + ".txt";
      }
      localStorage.setItem(filename, content);
      editor.setState(new CleanSavedState(filename));
      editor.refreshFilesList();
    }
  }
  newFile(editor: TextEditor): void {
    // TODO: Warnung vor Datenverlust? (Original hat das nicht)
    editor.textArea.value = "";
    editor.setState(new CleanUnsavedState());
  }
  openFile(editor: TextEditor, filename: string, content: string): void {
    // TODO: Warnung vor Datenverlust für aktuellen ungespeicherten Inhalt?
    editor.textArea.value = content;
    editor.setState(new CleanSavedState(filename));
  }
  getLabel(): string {
    return "*"; // Oder "[Untitled] *"
  }
  getFilename(): string | undefined {
    return undefined;
  }
}

class DirtySavedState implements EditorState {
  constructor(private filename: string) {}

  handleInput(editor: TextEditor): void {
    // Bleibt DirtySaved
  }
  save(editor: TextEditor): void {
    localStorage.setItem(this.filename, editor.textArea.value);
    editor.setState(new CleanSavedState(this.filename));
    editor.refreshFilesList();
  }
  saveAs(editor: TextEditor): void {
    const content = editor.textArea.value;
    let newFilename = prompt("Enter a File Name", this.filename);
    if (newFilename && newFilename.trim() !== "") {
      if (!newFilename.endsWith(".txt")) {
        newFilename = newFilename + ".txt";
      }
      localStorage.setItem(newFilename, content);
      editor.setState(new CleanSavedState(newFilename));
      editor.refreshFilesList();
    }
  }
  newFile(editor: TextEditor): void {
    // TODO: Warnung vor Datenverlust?
    editor.textArea.value = "";
    editor.setState(new CleanUnsavedState());
  }
  openFile(editor: TextEditor, filename: string, content: string): void {
    // TODO: Warnung vor Datenverlust für aktuellen DirtySaved Inhalt?
    editor.textArea.value = content;
    editor.setState(new CleanSavedState(filename));
  }
  getLabel(): string {
    return `${this.filename} *`;
  }
  getFilename(): string | undefined {
    return this.filename;
  }
}

// Initialisierung, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
  const editor = new TextEditor(); // eslint-disable-line @typescript-eslint/no-unused-vars
  // Das Context Menu Alert bleibt erhalten, wie im Original
  document.addEventListener("contextmenu", (event) => {
    alert("Wanna steal my source code, huh!?");
    event.preventDefault();
    return false;
  });
});