interface EditorState {
  filename?: string;
  handleInput(): EditorState;
  handleSave(): EditorState;
  handleSaveAs(): EditorState;
  getLabel(): string;
}

const textArea = document.getElementById("text") as HTMLTextAreaElement;

class CleanUnsavedState implements EditorState {
  handleInput = () => new DirtyUnsavedState();
  handleSave = () => this.handleSaveAs(); 
  handleSaveAs = () => saveWithPrompt(this);
  getLabel = () => '_';
}

class DirtyUnsavedState implements EditorState {
  handleInput = () => this;
  handleSave = () => this.handleSaveAs(); 
  handleSaveAs = () => saveWithPrompt(this);
  getLabel = () => '*';
}

class CleanSavedState implements EditorState {
  constructor(public filename: string) {}
  handleInput = () => new DirtySavedState(this.filename);
  handleSave = () => this; 
  handleSaveAs = () => saveWithPrompt(this);
  getLabel = () => this.filename;
}

class DirtySavedState implements EditorState {
  constructor(public filename: string) {}
  handleInput = () => this;
  handleSave = () => {
    localStorage.setItem(this.filename, textArea.value);
    showFiles(listFiles(), 'files-list');
    return new CleanSavedState(this.filename);
  };
  handleSaveAs = () => saveWithPrompt(this);
  getLabel = () => `${this.filename} *`;
}

let currentState: EditorState = new CleanUnsavedState();

document.addEventListener('DOMContentLoaded', () => {
  setState(currentState);
  showFiles(listFiles(), 'files-list');

  textArea.addEventListener('input', () => {
    setState(currentState.handleInput()); 
  });

  document.getElementById('save-as-button')?.addEventListener('click', () => {
    setState(currentState.handleSaveAs()); 
  });

  document.getElementById('save-button')?.addEventListener('click', () => {
    setState(currentState.handleSave()); 
  });

  document.getElementById('new-button')?.addEventListener('click', () => {
    textArea.value = '';
    setState(new CleanUnsavedState());
  });

  document.addEventListener('contextmenu', (event) => {
    alert("Wanna steal my source code, huh!?");
    event.preventDefault();
    return false;
  });
});

function setState(newState: EditorState) {
  currentState = newState;
  setStateLabel(currentState.getLabel());
}

function setStateLabel(value: string) {
  const stateLabel = document.getElementById("state-label");
  stateLabel.innerText = value;
}
function saveWithPrompt(previousState: EditorState): EditorState {
  let filename = prompt('Enter a File Name', currentState.filename || '');
  if (filename && filename.trim() !== '') {
    filename = filename.endsWith('.txt') ? filename : `${filename}.txt`;
    localStorage.setItem(filename, textArea.value);
    showFiles(listFiles(), 'files-list');
    return new CleanSavedState(filename);
  }
  return previousState;
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
      const content = localStorage.getItem(file);
      textArea.value = content;
      setState(new CleanSavedState(file))
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
