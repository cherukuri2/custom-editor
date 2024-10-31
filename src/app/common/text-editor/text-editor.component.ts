import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

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
  faChevronUp,
  faPaintBrush,
  faPaintRoller

} from '@fortawesome/free-solid-svg-icons';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit, OnChanges  {

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
  faPaintBrush = faPaintBrush;  // Font Awesome Icons
  faPaintRoller = faPaintRoller;

  private savedRange: Range | null = null;
  copiedStyle: { [key: string]: string } = {};  // Store copied formatting

  textContent: string = '';
  maxLength: number = 5000;

  content: string = ''; // Stores editor content

  @ViewChild('editorContent', { static: true }) editorContent!: ElementRef;

  @Input() initialFormattedText: string = ''; // Input to accept formatted text for editing

  @Output() formattedTextChange = new EventEmitter<string>();

  // savedContents: Array<{ id: number, content: SafeHtml }> = []; // Use SafeHtml type
  // editMode: boolean = false; // Toggles between edit and add mode
  // editingId: number | null = null; // Holds the ID of the item being edited
  // isExpanded: boolean = false; // Track expand/collapse state



  public kendoContent: string = '<p>Type your content here!</p>';
  // Function to handle form submission or saving content
  public saveKendoContent(): void {
    console.log('Saved content:', this.kendoContent);
  }



  symbolPaletteVisible = false;

  // List of symbols
  symbols: string[] = ['©', '®', '™', '±', '√', '∞', 'Ω', 'π', 'µ'];

  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer) {
  // Set the innerHTML of the contenteditable div directly with the plain HTML string
  this.renderer.setProperty(this.editorContent?.nativeElement, 'innerHTML', this.content);

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialFormattedText']) {
      this.content = this.initialFormattedText;
    }
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



  // Apply commands like bold, italic, etc.
  applyCommand(command: string) {
    this.restoreSelection();
    document.execCommand(command, false, '');
    this.onInput();
  }

  // Apply specific text color
  applyTextColor(event: Event) {
    const target = event.target as HTMLInputElement;
    const color = target.value;
    if (color) {
      this.restoreSelection();
      document.execCommand('foreColor', false, color);
      this.onInput();
    }
  }

  // Apply background color
  applyBackgroundColor(event: Event) {
    const target = event.target as HTMLInputElement;
    const color = target.value;
    if (color) {
      this.restoreSelection();
      document.execCommand('hiliteColor', false, color);
      this.onInput();
    }
  }

  // Undo the last action
  undo() {
    this.restoreSelection();
    document.execCommand('undo');
    this.onInput();
  }

  // Redo the last undone action
  redo() {
    this.restoreSelection();
    document.execCommand('redo');
    this.onInput();
  }

  // Change the font size
  changeFontSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const size = target.value;
    if (!size) return; // If no size is selected, do nothing

    // Save the current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Use execCommand to wrap the selected text in a <font> tag with size '7'
    document.execCommand('fontSize', false, '7');

    // Find the most recent <font> element added
    const fontElements = document.getElementsByTagName('font');
    for (let i = fontElements.length - 1; i >= 0; i--) {
        const fontElement = fontElements[i];
        // Check if the font element is within the current selection
        if (selection.containsNode(fontElement, true)) {
            fontElement.removeAttribute('size'); // Remove the default size attribute
            fontElement.style.fontSize = size; // Apply the selected font size
            break; // Stop once we handle the first match in reverse order
        }
    }

    this.onInput();
}


  // Change the heading
  changeHeading(event: Event) {
    const target = event.target as HTMLSelectElement; // Assert as HTMLSelectElement
    const heading = target.value;
    if (!heading) return; // If no heading is selected, do nothing
    this.restoreSelection();
    document.execCommand('formatBlock', false, heading);
    this.onInput();
  }

  // Insert Ordered List
  insertOrderedList() {
    this.restoreSelection();
    document.execCommand('insertOrderedList');
    this.onInput();
  }

  // Insert Unordered List
  insertUnorderedList() {
    this.restoreSelection();
    document.execCommand('insertUnorderedList');
    this.onInput();
  }

  // Indent the text
  indent() {
    this.restoreSelection();
    document.execCommand('indent');
    this.onInput();
  }

  // Outdent the text
  outdent() {
    this.restoreSelection();
    document.execCommand('outdent');
    this.onInput();
  }

  // Align Left
  alignLeft() {
    this.restoreSelection();
    document.execCommand('justifyLeft');
    this.onInput();
  }

  // Align Center
  alignCenter() {
    this.restoreSelection();
    document.execCommand('justifyCenter');
    this.onInput();
  }

  // Align Right
  alignRight() {
    this.restoreSelection();
    document.execCommand('justifyRight');
    this.onInput();
  }

  // Justify
  justify() {
    this.restoreSelection();
    document.execCommand('justifyFull');
    this.onInput();
  }


  // Apply strikethrough
  strikethrough() {
    this.restoreSelection();
    document.execCommand('strikeThrough', false, '');
    this.onInput();
  }

  // Apply subscript
  subscript() {
    this.restoreSelection();
    document.execCommand('subscript', false, '');
    this.onInput();
  }

  // Apply superscript
  superscript() {
    this.restoreSelection();
    document.execCommand('superscript', false, '');
    this.onInput();
  }

  // Change the font family
  changeFontFamily(event: Event) {
    const target = event.target as HTMLSelectElement; // Assert as HTMLSelectElement
    const fontFamily = target.value;
    if (!fontFamily) return; // If no font family is selected, do nothing
    this.restoreSelection();
    document.execCommand('fontName', false, fontFamily);
    this.onInput();
  }

  // Insert symbols
  insertSymbol(event: Event) {
    const target = event.target as HTMLSelectElement; // Assert as HTMLSelectElement
    const symbolType = target.value;
    this.restoreSelection();
    document.execCommand('insertText', false, symbolType);
    this.onInput();
  }

  // Clear all formatting
  clearFormatting() {
    this.restoreSelection();
    document.execCommand('removeFormat', false, '');
    this.onInput();
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
        this.onInput();
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
      this.onInput();
    }
  }

  onInput() {
    const formattedText = this.editorContent.nativeElement.innerHTML;
    this.formattedTextChange.emit(formattedText);
    this.saveSelection();
  }

  // Function to sanitize HTML before rendering
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // Copy format from selected text
  copyFormat() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedNode = selection.anchorNode?.parentElement;
    if (selectedNode) {
      const computedStyle = window.getComputedStyle(selectedNode);
      // Store relevant styles (add more styles if needed)
      this.copiedStyle = {
        fontWeight: computedStyle.fontWeight,
        fontStyle: computedStyle.fontStyle,
        textDecoration: computedStyle.textDecoration,
        fontSize: computedStyle.fontSize,
        color: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
      };
    }
  }

  // Apply format to the selected text
  applyFormat() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedNode = selection.anchorNode?.parentElement;
    if (selectedNode) {
      // Apply the copied styles
      Object.keys(this.copiedStyle).forEach(property => {
        selectedNode.style[property  as any] = this.copiedStyle[property];
      });
    }
  }

}
