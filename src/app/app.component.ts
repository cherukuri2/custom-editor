import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {

  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  textContent: string = '';
  maxLength: number = 5000;

  content: string = ''; // Stores editor content
  savedContents: Array<{ id: number, content: string }> = []; // Use SafeHtml type
  editMode: boolean = false; // Toggles between edit and add mode
  editingId: number | null = null; // Holds the ID of the item being edited
  isExpanded: boolean = false; // Track expand/collapse state


  symbolPaletteVisible = false;

  // List of symbols
  symbols: string[] = ['©', '®', '™', '±', '√', '∞', 'Ω', 'π', 'µ'];
  formattedText: string = '';


  constructor(private sanitizer: DomSanitizer) {
    this.loadSavedContents(); // Load saved contents on component initialization
  }

  // Save editor content to localStorage
  saveContent() {
    //const safeFormattedText = this.sanitizer.bypassSecurityTrustHtml(this.formattedText);
    const safeFormattedText = this.formattedText;

    if (this.editMode && this.editingId !== null) {
      // Edit mode: Update the existing content
      this.savedContents = this.savedContents.map(item => {
        if (item.id === this.editingId) {
          return { id: item.id, content: safeFormattedText };
        }
        return item;
      });
    } else {
      // Add mode: Save new content
      const newContent = {
        id: Date.now(), // Use timestamp as unique ID
        content: safeFormattedText // Save HTML content
      };
      console.log('Saving content: ' + JSON.stringify(newContent));
      this.savedContents.push(newContent);
    }
    this.updateLocalStorage(); // Update localStorage
    this.resetEditor(); // Clear the editor
  }

  // Sanitize the HTML content
  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  // Edit a specific saved row
  editContent(id: number) {
    console.log('Editing record: ' + id);
    const itemToEdit = this.savedContents.find(item => item.id === id);
    if (itemToEdit) {
      console.log('Editing record found: ' + JSON.stringify(itemToEdit));
      this.formattedText = itemToEdit.content as string; // Load the saved HTML content back into the editor
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
    this.content = ''; // Clear the editor content
    this.editMode = false; // Reset the edit mode
    this.editingId = null; // Reset the editing ID
  }

  // Function to get the truncated content for display
  getTruncatedContent(content: SafeHtml): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content as string; // Cast SafeHtml to string
    const textContent = tempDiv.textContent || tempDiv.innerText || ''; // Get the plain text

    // Return the first 50 characters or full content if less than 50 characters
    return textContent.length > 50 ? textContent.substring(0, 50) + '...' : textContent;
  }


  get remainingCharacters(): number {
    return this.maxLength - this.textContent.length;
  }

  onFormattedTextChange(text: string) {
    this.formattedText = text;
  }
  // Toggle the expand/collapse state
  toggleExpandCollapse() {
    this.isExpanded = !this.isExpanded;
  }

  // Function to sanitize HTML before rendering
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
