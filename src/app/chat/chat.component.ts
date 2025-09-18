import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChatService, ChatResponse } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ChatComponent {
  messages: { sender: string, text: string }[] = [];
  userInput: string = '';
  conversationId?: string;
  isOpen = false;

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'You', text: this.userInput });

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

    this.userInput = '';
  }
}