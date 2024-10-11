import { Component } from '@angular/core';
import { 
  faBold, 
  faItalic, 
  faUnderline,
  faFillDrip, 
  faTint, 
  faCut, 
  faCopy, 
  faPaste, 
  faUndo, 
  faRedo, 
  faListOl, 
  faListUl, 
  faIndent, 
  faOutdent, 
  faAlignLeft, 
  faAlignCenter, 
  faAlignRight, 
  faAlignJustify, 
  faStrikethrough, 
  faSuperscript, 
  faSubscript, 
  faFont , 
  faLink, // Importing the link icon
  faEraser, // Importing an eraser icon
  faChevronDown, 
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  faBold = faBold;
  faUnderline = faUnderline;
  faItalic = faItalic;
  faTextColor = faTint; 
  faBgColor = faFillDrip; 
  faCut = faCut; 
  faCopy = faCopy; 
  faPaste = faPaste; 
  faUndo = faUndo; 
  faRedo = faRedo; 
  faListOl = faListOl; 
  faListUl = faListUl; 
  faIndent = faIndent; 
  faOutdent = faOutdent; 
  faAlignLeft = faAlignLeft; 
  faAlignCenter = faAlignCenter; 
  faAlignRight = faAlignRight; 
  faAlignJustify = faAlignJustify; 
  faStrikethrough = faStrikethrough; 
  faSuperscript = faSuperscript; 
  faSubscript = faSubscript; 
  faFont = faFont; 
  faLink = faLink; // Assigning the link icon
  faEraser = faEraser; // Assigning the eraser icon
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  private savedRange: Range | null = null;

  textContent: string = '';
  maxLength: number = 5000;

  content: string = ''; // Stores editor content
  savedContents: Array<{ id: number, content: string }> = []; // Stores saved content with IDs
  editMode: boolean = false; // Toggles between edit and add mode
  editingId: number | null = null; // Holds the ID of the item being edited
  isExpanded: boolean = false; // Track expand/collapse state


  constructor() {
    this.loadSavedContents(); // Load saved contents on component initialization
  }

  // Save editor content to localStorage
  saveContent() {
    if (this.editMode && this.editingId !== null) {
      // Edit mode: Update the existing content
      this.savedContents = this.savedContents.map(item => {
        if (item.id === this.editingId) {
          return { id: item.id, content: this.textContent };
        }
        return item;
      });
    } else {
      // Add mode: Save new content
      const newContent = {
        id: Date.now(), // Use timestamp as unique ID
        content: this.textContent // Save HTML content
      };
      console.log('Saving content: ' + newContent.content);
      this.savedContents.push(newContent);
    }
    this.updateLocalStorage(); // Update localStorage
    this.resetEditor(); // Clear the editor
  }

  // Edit a specific saved row
  editContent(id: number) {
    const itemToEdit = this.savedContents.find(item => item.id === id);
    if (itemToEdit) {
      this.content = itemToEdit.content; // Load the saved HTML content back into the editor
      this.editMode = true; // Switch to edit mode
      this.editingId = id; // Set the editing ID
    }
  }

  // Load saved contents from localStorage
  loadSavedContents() {
    const data = localStorage.getItem('savedContents');
    if (data) {
      this.savedContents = JSON.parse(data);
    }
  }

  // Update localStorage with the current saved contents
  updateLocalStorage() {
    localStorage.setItem('savedContents', JSON.stringify(this.savedContents));
  }

  // Delete a specific saved row
  deleteContent(id: number) {
    this.savedContents = this.savedContents.filter(item => item.id !== id);
    this.updateLocalStorage(); // Update localStorage after deletion
  }

  // Reset the editor after saving or canceling
  resetEditor() {
    console.log('Resetting editor');
    this.textContent = '';
    this.content = ''; // Clear the editor content
    this.editMode = false; // Reset the edit mode
    this.editingId = null; // Reset the editing ID
  }

  // Function to get the truncated content for display
  getTruncatedContent(content: string): string {
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  }

  get remainingCharacters(): number {
    return this.maxLength - this.textContent.length;
  }

  // Save the current caret position (selection range)
  saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0);
    }
  }

  // Restore the saved caret position (selection range)
  restoreSelection() {
    const selection = window.getSelection();
    if (selection && this.savedRange) {
      selection.removeAllRanges();
      selection.addRange(this.savedRange);
    }
  }

  // Toggle the expand/collapse state
  toggleExpandCollapse() {
    this.isExpanded = !this.isExpanded;
  }

  // Apply commands like bold, italic, etc.
  applyCommand(command: string) {
    this.restoreSelection();
    document.execCommand(command, false, '');
  }

  // Apply specific text color
  applyTextColor(event: Event) {
    const target = event.target as HTMLInputElement;
    const color = target.value;
    if (color) {
      this.restoreSelection();
      document.execCommand('foreColor', false, color);
    }
  }

  // Apply background color
  applyBackgroundColor(event: Event) {
    const target = event.target as HTMLInputElement;
    const color = target.value;
    if (color) {
      this.restoreSelection();
      document.execCommand('hiliteColor', false, color);
    }
  }

  // Undo the last action
  undo() {
    this.restoreSelection();
    document.execCommand('undo');
  }

  // Redo the last undone action
  redo() {
    this.restoreSelection();
    document.execCommand('redo');
  }

  // Change the font size
  changeFontSize(event: Event) {
    const target = event.target as HTMLSelectElement; // Assert as HTMLSelectElement
    const size = target.value;
    if (!size) return; // If no size is selected, do nothing
    this.restoreSelection();
    document.execCommand('fontSize', false, '7'); // '7' is the largest size
    const fontElements = document.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
      fontElements[i].removeAttribute('size');
      fontElements[i].style.fontSize = size; // Set custom size
    }
  }

  // Change the heading
  changeHeading(event: Event) {
    const target = event.target as HTMLSelectElement; // Assert as HTMLSelectElement
    const heading = target.value;
    if (!heading) return; // If no heading is selected, do nothing
    this.restoreSelection();
    document.execCommand('formatBlock', false, heading);
  }

  // Insert Ordered List
  insertOrderedList() {
    this.restoreSelection();
    document.execCommand('insertOrderedList');
  }

  // Insert Unordered List
  insertUnorderedList() {
    this.restoreSelection();
    document.execCommand('insertUnorderedList');
  }

  // Indent the text
  indent() {
    this.restoreSelection();
    document.execCommand('indent');
  }

  // Outdent the text
  outdent() {
    this.restoreSelection();
    document.execCommand('outdent');
  }

  // Align Left
  alignLeft() {
    this.restoreSelection();
    document.execCommand('justifyLeft');
  }

  // Align Center
  alignCenter() {
    this.restoreSelection();
    document.execCommand('justifyCenter');
  }

  // Align Right
  alignRight() {
    this.restoreSelection();
    document.execCommand('justifyRight');
  }

  // Justify
  justify() {
    this.restoreSelection();
    document.execCommand('justifyFull');
  }


  // Apply strikethrough
  strikethrough() {
    this.restoreSelection();
    document.execCommand('strikeThrough', false, '');
  }

  // Apply subscript
  subscript() {
    this.restoreSelection();
    document.execCommand('subscript', false, '');
  }

  // Apply superscript
  superscript() {
    this.restoreSelection();
    document.execCommand('superscript', false, '');
  }

  // Change the font family
  changeFontFamily(event: Event) {
    const target = event.target as HTMLSelectElement; // Assert as HTMLSelectElement
    const fontFamily = target.value;
    if (!fontFamily) return; // If no font family is selected, do nothing
    this.restoreSelection();
    document.execCommand('fontName', false, fontFamily);
  }

  // Insert symbols
  insertSymbol(symbol: string) {
    this.restoreSelection();
    document.execCommand('insertText', false, symbol);
  }

  // Clear all formatting
  clearFormatting() {
    this.restoreSelection();
    document.execCommand('removeFormat', false, '');
  }

  insertLink() {
    const selectedText = window.getSelection()?.toString();
    
    // Pre-fill the prompt with 'https://'
    let url = prompt('Enter the URL', 'https://');
  
    if (url) {
      // Check if the URL starts with 'http://' or 'https://', and add 'https://' if not
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
  
      this.restoreSelection();
  
      if (selectedText && selectedText.length > 0) {
        const linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
        document.execCommand('insertHTML', false, linkHTML);
      } else {
        alert('Please select some text to add the link to.');
      }
    }
  }

  // Update text content and count remaining characters
  updateTextContent(event: Event) {
    const target = event.target as HTMLDivElement;
    this.textContent = target.innerHTML;
  }

  // Function to limit the text input
  limitTextLength(event: KeyboardEvent) {
    const textContent = (event.target as HTMLElement)?.innerText || '';
    if (textContent.length >= this.maxLength && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();  // Prevent input when limit is reached
    }
  }

  // Handle paste event to restrict pasted content
  onPaste(event: ClipboardEvent) {
    event.preventDefault();  // Prevent the default paste action
    const clipboardData = event.clipboardData?.getData('text') || '';  // Get plain text from clipboard
    const textContent = (event.target as HTMLElement)?.innerText || '';  // Get the existing text in the div

    // Determine how many characters are allowed to be pasted
    const charsLeft = this.maxLength - textContent.length;
    if (charsLeft > 0) {
      const textToPaste = clipboardData.substring(0, charsLeft);  // Truncate the pasted text if necessary
      document.execCommand('insertText', false, textToPaste);  // Insert the allowed portion of text
    }
  }


}
