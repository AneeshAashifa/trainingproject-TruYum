import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService, ChatResponse } from '../services/chat.service';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: { sender: string, text: string }[] = [];
  userInput: string = '';
  conversationId?: string;
  isOpen = false;
  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Push user message
    this.messages.push({ sender: 'You', text: this.userInput });

    // Call backend
    this.chatService.sendMessage({ message: this.userInput, conversationId: this.conversationId })
      .subscribe({
        next: (res: ChatResponse) => {
          this.conversationId = res.conversationId;
          this.messages.push({ sender: 'Bot', text: res.reply });
        },
        error: () => {
          this.messages.push({ sender: 'Bot', text: '⚠️ Error connecting to AI service.' });
        }
      });

    // Clear input
    this.userInput = '';
  }
}