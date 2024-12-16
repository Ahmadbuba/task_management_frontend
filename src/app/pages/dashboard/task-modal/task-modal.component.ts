import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent {
  taskForm: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.isEditMode = !!data;

    this.taskForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || '', Validators.required],
      priority: [
        data?.priority || '',
        [Validators.required, Validators.min(1)],
      ],
      dueDate: [
        data?.dueDate ? new Date(data.dueDate) : '',
        Validators.required,
      ],
      time: [data?.dueDate ? this.extractTimeFromISOString(data.dueDate) : ''],
      completed: [data?.completed || false],
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) return;

    const task = this.taskForm.value;

    // Combine `dueDate` and `time` into an ISO 8601 string
    const dueDate = new Date(task.dueDate);
    if (task.time) {
      const [hours, minutes] = task.time.split(':');
      dueDate.setHours(+hours, +minutes);
    }

    task.dueDate = dueDate.toISOString(); // Convert to ISO 8601 format

    if (this.isEditMode) {
      this.taskService
        .updateTask(this.data.id, task)
        .subscribe(() => this.dialogRef.close(true));
    } else {
      this.taskService
        .createTask(task)
        .subscribe(() => this.dialogRef.close(true));
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private extractTimeFromISOString(isoString: string): string {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
