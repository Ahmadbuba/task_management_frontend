import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

export interface TaskRequest {
  title: string;
  description: string;
  priority: number;
  dueDate: string; // Assuming ISO 8601 date-time string
}

export interface TaskRequest {
  title: string;
  description: string;
  priority: number;
  dueDate: string; // ISO 8601 format
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  priority: number;
  dueDate: string; // Assuming ISO 8601 date-time string
  completed: boolean;
}

export interface TasksResponse {
  tasks: TaskResponse[];
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl: string = environment.apiUrl + 'task-management';

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<TasksResponse>(`${this.baseUrl}`);
  }

  createTask(task: TaskRequest) {
    return this.http.post<TaskResponse>(`${this.baseUrl}`, task);
  }

  updateTask(taskId: string, task: TaskRequest) {
    return this.http.put<TaskResponse>(`${this.baseUrl}/${taskId}`, task);
  }

  deleteTask(taskId: string) {
    return this.http.delete(`${this.baseUrl}/${taskId}`);
  }

  setTaskComplete(taskId: string) {
    return this.http.put<TaskResponse>(
      `${this.baseUrl}/${taskId}/complete`,
      {}
    );
  }

  setTaskIncomplete(taskId: string) {
    return this.http.put<TaskResponse>(
      `${this.baseUrl}/${taskId}/incomplete`,
      {}
    );
  }
}
