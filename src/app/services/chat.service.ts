import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  reply: string;
  conversationId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5030/api/chat/message';

  constructor(private http: HttpClient) {}

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, request);
  }
}