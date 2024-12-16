import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TaskService } from 'src/app/services/task.service';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort | null = null;

  tasks: any[] = [];
  filteredTasks = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'title',
    'description',
    'priority',
    'dueDate',
    'completed',
    'actions',
  ];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((response) => {
      this.tasks = response.tasks;
      this.filteredTasks.data = this.tasks;
      // Assign MatSort to the data source
      if (this.sort) {
        this.filteredTasks.sort = this.sort;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredTasks.filter = filterValue.trim().toLowerCase();
  }

  openTaskModal(): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  editTask(task: any): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '400px',
      data: task,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe(() => this.loadTasks());
  }

  toggleTaskCompletion(task: any): void {
    if (task.completed) {
      this.taskService.setTaskIncomplete(task.id).subscribe(() => {
        task.completed = false;
      });
    } else {
      this.taskService.setTaskComplete(task.id).subscribe(() => {
        task.completed = true;
      });
    }
  }

  navigateToPersonalDetail() {
    this.router.navigate(['/personal-detail']);
  }
}
